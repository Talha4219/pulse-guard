'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/pulseguard/header';
import { VitalsMonitor } from '@/components/pulseguard/vitals-monitor';
import { AlarmForm } from '@/components/pulseguard/alarm-form';
import { AppointmentForm } from '@/components/pulseguard/appointment-form';
import { AlarmNotification } from '@/components/pulseguard/alarm-notification';
import { HealthAdvisor } from '@/components/pulseguard/health-advisor';
import { HealthAlertDialog } from '@/components/pulseguard/health-alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarClock } from 'lucide-react';
import { motion } from 'framer-motion';

// This type definition is now local as the AI flow is removed.
export interface HealthSuggestionOutput {
  overallStatus: 'normal' | 'elevated' | 'low' | 'critical' | 'no_data';
  precautions: string[];
  possibleDiseases: string[];
}

// Simple rule-based function to generate health suggestions
const getLocalHealthSuggestions = (vitals: { heartRate: number; spo2: number }): HealthSuggestionOutput | null => {
  const { heartRate, spo2 } = vitals;

  if (heartRate === 0 || spo2 === 0) {
    return null;
  }

  let overallStatus: HealthSuggestionOutput['overallStatus'] = 'normal';
  let precautions: string[] = [];
  let possibleDiseases: string[] = [];

  // Heart Rate Logic
  if (heartRate > 130) {
    overallStatus = 'critical';
    precautions.push('Your heart rate is very high. Please rest and seek medical attention if it does not come down.');
    possibleDiseases.push('Severe tachycardia');
  } else if (heartRate > 100) {
    overallStatus = 'elevated';
    precautions.push('Your heart rate is elevated. Try some deep breathing exercises and reduce caffeine intake.');
    possibleDiseases.push('Tachycardia, possibly from stress or exertion.');
  } else if (heartRate < 50) {
    overallStatus = 'critical';
    precautions.push('Your heart rate is very low. If you feel faint or dizzy, seek medical help immediately.');
    possibleDiseases.push('Severe bradycardia');
  } else if (heartRate < 60) {
    overallStatus = 'low';
    precautions.push('Your heart rate is lower than average. Monitor for symptoms like dizziness.');
    possibleDiseases.push('Bradycardia');
  }

  // SpO2 Logic
  if (spo2 < 90) {
    overallStatus = 'critical';
    precautions.push('Your oxygen level is critically low. Seek emergency medical attention.');
    possibleDiseases.push('Severe hypoxemia');
  } else if (spo2 < 95) {
    if (overallStatus !== 'critical') overallStatus = 'low';
    precautions.push('Your oxygen level is slightly low. Ensure good ventilation and try to sit upright.');
    possibleDiseases.push('Mild hypoxemia');
  }

  if (overallStatus === 'normal') {
    precautions.push('Your vitals are in a normal range. Keep up the healthy habits!');
    possibleDiseases.push('No immediate concerns based on this data.');
  }

  possibleDiseases.push('This is not a medical diagnosis. Consult a healthcare professional.');


  return {
    overallStatus,
    precautions,
    possibleDiseases,
  };
};


export default function Home() {
  const [vitals, setVitals] = useState({ heartRate: 0, spo2: 0 });
  const [historicalHeartRates, setHistoricalHeartRates] = useState<number[]>([]);
  const [alarmTime, setAlarmTime] = useState<string | null>(null);
  const [appointment, setAppointment] = useState<{ doctor: string; time: string; _id: string } | null>(null);
  const [isAlarmRinging, setIsAlarmRinging] = useState(false);
  const [healthSuggestions, setHealthSuggestions] = useState<HealthSuggestionOutput | null>(null);
  const [isHealthAlertOpen, setIsHealthAlertOpen] = useState(false);
  const [alertedDisease, setAlertedDisease] = useState<string | null>(null);
  const { toast } = useToast();
  const lastDiseaseTimestamp = useRef<number | null>(null);

  // Fetch vitals from the server
  const fetchVitals = useCallback(async () => {
    try {
      const response = await fetch('/api/vitals');
      if (response.ok) {
        const data = await response.json();
        // The store uses 'pulse' for spo2
        setVitals({ heartRate: data.heartRate, spo2: data.pulse });
      }
    } catch (error) {
      console.error('Failed to fetch vitals:', error);
    }
  }, []);

  useEffect(() => {
    const vitalsInterval = setInterval(fetchVitals, 2000); // Poll for new vitals every 2 seconds
    return () => clearInterval(vitalsInterval);
  }, [fetchVitals]);


  // Generate Health Suggestions locally
  useEffect(() => {
    const suggestions = getLocalHealthSuggestions(vitals);
    setHealthSuggestions(suggestions);
  }, [vitals]);

  // Fetch the alarm time from the server
  const fetchAlarm = useCallback(async () => {
    try {
      const response = await fetch('/api/alarm');
      if (response.ok) {
        const data = await response.json();
        setAlarmTime(data.time || null);
      }
    } catch (error) {
      console.error('Failed to fetch alarm:', error);
    }
  }, []);

  // Fetch for appointments
  const fetchAppointment = useCallback(async () => {
    try {
      const response = await fetch('/api/appointment');
      if (response.ok) {
        const data = await response.json();
        // The API returns an array now. Find the latest scheduled one.
        if (Array.isArray(data)) {
          const scheduled = data.find((a: any) => a.status === 'scheduled');
          setAppointment(scheduled || null);
        } else if (data && data.status === 'scheduled') {
          setAppointment(data);
        } else {
          setAppointment(null);
        }
      }
    } catch (error) {
      console.error('Failed to fetch appointment:', error);
    }
  }, []);

  // Fetch for disease reports
  const fetchDisease = useCallback(async () => {
    try {
      const response = await fetch('/api/disease');
      if (response.ok) {
        const data = await response.json();
        if (data.name && data.timestamp && data.timestamp !== lastDiseaseTimestamp.current) {
          lastDiseaseTimestamp.current = data.timestamp;
          setAlertedDisease(data.name);
          setIsHealthAlertOpen(true);
        }
      }
    } catch (error) {
      console.error('Failed to fetch disease report:', error);
    }
  }, []);

  useEffect(() => {
    fetchAlarm(); // Fetch on initial load
    fetchAppointment();
    const alarmFetchInterval = setInterval(fetchAlarm, 5000); // And poll for changes
    const appointmentFetchInterval = setInterval(fetchAppointment, 5000);
    const diseaseFetchInterval = setInterval(fetchDisease, 5000); // Poll for new disease reports
    return () => {
      clearInterval(alarmFetchInterval);
      clearInterval(appointmentFetchInterval);
      clearInterval(diseaseFetchInterval);
    }
  }, [fetchAlarm, fetchAppointment, fetchDisease]);

  // Check if alarm should be ringing
  useEffect(() => {
    if (!alarmTime) return;

    const checkAlarm = () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      if (currentTime === alarmTime && !isAlarmRinging) {
        console.log('Alarm ringing!');
        setIsAlarmRinging(true);
      }
    };

    const alarmCheckInterval = setInterval(checkAlarm, 1000); // Check every second
    return () => clearInterval(alarmCheckInterval);
  }, [alarmTime, isAlarmRinging]);

  // Set alarm status to "ringing" when the alarm starts
  useEffect(() => {
    if (!isAlarmRinging) return;

    const triggerAlarm = async () => {
      try {
        await fetch('/api/alarm/trigger', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'ringing' })
        });
      } catch (error) {
        console.error('Failed to trigger alarm on server:', error);
      }
    };

    triggerAlarm();
  }, [isAlarmRinging]);

  // Update historical data when vitals change
  useEffect(() => {
    if (vitals.heartRate > 0) {
      setHistoricalHeartRates(prev => {
        const newHistory = [...prev, vitals.heartRate];
        // Keep the last 30 readings
        if (newHistory.length > 30) {
          newHistory.shift();
        }
        return newHistory;
      });
    }
  }, [vitals.heartRate]);

  const handleStopAlarm = async () => {
    setIsAlarmRinging(false);
    setAlarmTime(null);

    // Reset alarm on the server
    await fetch('/api/alarm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ time: null })
    });

    // Reset alarm trigger status on the server
    await fetch('/api/alarm/trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'idle' })
    });
  };

  const handleAlarmSet = () => {
    // Refetch alarm time immediately after it's set
    fetchAlarm();
  };

  const clearDiseaseAlert = async () => {
    setIsHealthAlertOpen(false);
    try {
      await fetch('/api/disease', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disease: null }),
      });
    } catch (error) {
      console.error('Failed to clear disease alert:', error);
    }
  };

  const handleAcknowledgeAlert = async () => {
    clearDiseaseAlert(); // Clear the alert first

    try {
      await fetch('/api/doctor/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'coming' }),
      });
      toast({
        title: 'Acknowledged',
        description: 'You are on your way to assist the patient. The device has been notified.',
      });
    } catch (error) {
      console.error('Failed to send acknowledgement:', error);
      toast({
        title: 'Error',
        description: 'Could not send acknowledgement. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-primary/20 rounded-full blur-[128px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-accent/20 rounded-full blur-[128px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }} />
      </div>

      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8 z-10 relative">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <VitalsMonitor heartRate={vitals.heartRate} spo2={vitals.spo2} />
          </motion.div>

          <motion.div
            className="lg:col-span-1 space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            <AlarmForm
              onAlarmSet={handleAlarmSet}
            />
            <AppointmentForm onAppointmentCreated={fetchAppointment} />
            {appointment && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring" }}
              >
                <Card className="glass-panel border-primary/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <div className="p-2 rounded-full bg-primary/20 ring-1 ring-primary/40">
                        <CalendarClock className="h-5 w-5 text-primary" />
                      </div>
                      Upcoming Appointment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg text-white/90">
                      You have an appointment with <strong>{appointment.doctor}</strong> at{' '}
                      <span className="font-bold text-primary text-xl ml-1">{appointment.time}</span>.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>

        <div className="mt-8">
          <HealthAdvisor suggestions={healthSuggestions} isLoading={false} />
        </div>
      </main>
      <footer className="py-6 text-center text-muted-foreground text-sm relative z-10 border-t border-white/5 bg-black/20 backdrop-blur-sm mt-auto">
        <p>&copy; {new Date().getFullYear()} PillPulse. All rights reserved.</p>
      </footer>
      <AlarmNotification isOpen={isAlarmRinging} onStop={handleStopAlarm} alarmTime={alarmTime} />
      <HealthAlertDialog
        isOpen={isHealthAlertOpen}
        diseaseName={alertedDisease}
        onClose={clearDiseaseAlert}
        onAcknowledge={handleAcknowledgeAlert}
      />
    </div>
  );
}