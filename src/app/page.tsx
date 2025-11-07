'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/pulseguard/header';
import { VitalsMonitor } from '@/components/pulseguard/vitals-monitor';
import { AlarmForm } from '@/components/pulseguard/alarm-form';

export default function Home() {
  const [vitals, setVitals] = useState({ heartRate: 0, spo2: 0 });
  const [historicalHeartRates, setHistoricalHeartRates] = useState<number[]>([]);

  useEffect(() => {
    const fetchVitals = async () => {
      try {
        // In a real app, you would have the base URL in environment variables.
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';
        const response = await fetch(new URL('/api/vitals', baseUrl));
        if (response.ok) {
          const data = await response.json();
          setVitals({ heartRate: data.heartRate || 0, spo2: data.pulse || 0 });
        } else {
          // If the API fails, reset to 0
          setVitals({ heartRate: 0, spo2: 0 });
        }
      } catch (error) {
        console.error('Failed to fetch vitals:', error);
        setVitals({ heartRate: 0, spo2: 0 });
      }
    };

    fetchVitals(); // Fetch immediately on mount
    const interval = setInterval(fetchVitals, 2500); // Poll every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // This effect is kept to update historical data for the alarm form,
    // assuming the vitals state reflects the latest data from the ESP32.
    if (vitals.heartRate > 0) {
      setHistoricalHeartRates(prev => {
        const newHistory = [...prev, vitals.heartRate];
        // Keep a rolling window of the last 30 readings for the AI analysis
        if (newHistory.length > 30) {
          newHistory.shift();
        }
        return newHistory;
      });
    }
  }, [vitals.heartRate]);

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
            />
          </div>
        </div>
      </main>
      <footer className="py-4 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} PulseGuard. All rights reserved.</p>
      </footer>
    </div>
  );
}
