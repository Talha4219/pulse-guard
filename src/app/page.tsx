'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/pulseguard/header';
import { VitalsMonitor } from '@/components/pulseguard/vitals-monitor';
import { AlarmForm } from '@/components/pulseguard/alarm-form';
import { AlarmNotification } from '@/components/pulseguard/alarm-notification';

export default function Home() {
  const [vitals, setVitals] = useState({ heartRate: 0, spo2: 0 });
  const [historicalHeartRates, setHistoricalHeartRates] = useState<number[]>([]);
  const [alarmTime, setAlarmTime] = useState<string | null>(null);
  const [isAlarmRinging, setIsAlarmRinging] = useState(false);

  // Fetch vitals from the API
  useEffect(() => {
    const fetchVitals = async () => {
      try {
        const response = await fetch('/api/vitals');
        if (response.ok) {
          const data = await response.json();
          setVitals({ heartRate: data.heartRate || 0, spo2: data.pulse || 0 });
        } else {
          // If the API call fails, default to 0
          setVitals({ heartRate: 0, spo2: 0 });
        }
      } catch (error) {
        console.error('Failed to fetch vitals:', error);
        setVitals({ heartRate: 0, spo2: 0 });
      }
    };

    const vitalsInterval = setInterval(fetchVitals, 2500); // Poll every 2.5 seconds
    return () => clearInterval(vitalsInterval);
  }, []);

  // Fetch the alarm time from the server
  const fetchAlarm = useCallback(async () => {
    try {
      const response = await fetch('/api/alarm');
      if (response.ok) {
        const data = await response.json();
        if (data.time) {
          setAlarmTime(data.time);
        }
      }
    } catch (error) {
      console.error('Failed to fetch alarm:', error);
    }
  }, []);

  useEffect(() => {
    fetchAlarm(); // Fetch on initial load
    const alarmFetchInterval = setInterval(fetchAlarm, 5000); // And poll for changes
    return () => clearInterval(alarmFetchInterval);
  }, [fetchAlarm]);
  
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
  
  // Trigger beeping API when alarm is ringing
  useEffect(() => {
    if (!isAlarmRinging) return;

    const triggerBeep = async () => {
        try {
            await fetch('/api/alarm/trigger', { method: 'POST' });
        } catch (error) {
            console.error('Failed to trigger alarm beep:', error);
        }
    };
    
    triggerBeep(); // Trigger immediately
    const beepInterval = setInterval(triggerBeep, 2000); // And every 2 seconds

    return () => clearInterval(beepInterval);
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

  const handleStopAlarm = () => {
    setIsAlarmRinging(false);
    // To prevent it from re-triggering in the same minute, we can clear the alarm time
    setAlarmTime(null); 
    // You might want to also clear it on the server
    fetch('/api/alarm', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ time: null }) 
    });
  };
  
  const handleAlarmSet = () => {
    // Refetch alarm time immediately after it's set
    fetchAlarm();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <VitalsMonitor heartRate={vitals.heartRate} spo2={vitals.spo2} />
          </div>
          <div className="lg:col-span-1">
            <AlarmForm
              currentHeartRate={vitals.heartRate}
              historicalHeartRates={historicalHeartRates}
              onAlarmSet={handleAlarmSet}
            />
          </div>
        </div>
      </main>
      <footer className="py-4 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} PulseGuard. All rights reserved.</p>
      </footer>
      <AlarmNotification isOpen={isAlarmRinging} onStop={handleStopAlarm} />
    </div>
  );
}
