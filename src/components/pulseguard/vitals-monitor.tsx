'use client';

import { HeartPulse, Activity, Bell, ShieldCheck } from 'lucide-react';
import { DataCard } from './data-card';
import { motion } from 'framer-motion';

interface VitalsMonitorProps {
  heartRate: number | null;
  spo2: number | null;
  status: string; // 'normal' | 'critical' etc
  nextAlarm: string | null;
}

export function VitalsMonitor({ heartRate, spo2, status, nextAlarm }: VitalsMonitorProps) {
  return (
    <div className="space-y-6">
      <motion.h2
        className="text-2xl font-bold tracking-tight text-white mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Live Vitals
      </motion.h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DataCard
          title="Heart Rate"
          value={heartRate}
          unit="BPM"
          icon={HeartPulse}
          description="Real-time heart beat monitoring."
          index={0}
        />
        <DataCard
          title="SpO2 Level"
          value={spo2}
          unit="%"
          icon={Activity}
          description="Blood oxygen saturation."
          index={1}
        />
        <DataCard
          title="Overall Status"
          value={status === 'critical' ? 'CRITICAL' : status === 'elevated' ? 'WARNING' : 'NORMAL'}
          unit=""
          icon={ShieldCheck}
          description="AI-driven health assessment."
          index={2}
        />
        <DataCard
          title="Next Alarm"
          value={nextAlarm || "No Alarm"}
          unit=""
          icon={Bell}
          description="Upcoming medication reminder."
          index={3}
        />
      </div>
    </div>
  );
}
