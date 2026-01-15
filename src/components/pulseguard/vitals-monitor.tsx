'use client';

import { HeartPulse, Waves, Droplets, Gauge } from 'lucide-react';
import { DataCard } from './data-card';
import { motion } from 'framer-motion';

interface VitalsMonitorProps {
  heartRate: number | null;
  spo2: number | null;
}

export function VitalsMonitor({ heartRate, spo2 }: VitalsMonitorProps) {
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
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        <DataCard
          title="Heart Rate"
          value={heartRate}
          unit="BPM"
          icon={HeartPulse}
          description="Beats per minute from your device."
          index={0}
        />
        <DataCard
          title="Oxygen Saturation"
          value={spo2}
          unit="SpO2 %"
          icon={Waves}
          description="Blood oxygen level."
          index={1}
        />
        <DataCard
          title="Blood Sugar"
          value={null}
          unit="mg/dL"
          icon={Droplets}
          description="Coming soon."
          index={2}
        />
        <DataCard
          title="Blood Pressure"
          value={null}
          unit="mmHg"
          icon={Gauge}
          description="Coming soon."
          index={3}
        />
      </div>
    </div>
  );
}
