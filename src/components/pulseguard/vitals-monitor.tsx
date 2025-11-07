import { HeartPulse, Waves } from 'lucide-react';
import { DataCard } from './data-card';

interface VitalsMonitorProps {
  heartRate: number | null;
  spo2: number | null;
}

export function VitalsMonitor({ heartRate, spo2 }: VitalsMonitorProps) {
  return (
    <div className="space-y-6">
       <h2 className="text-2xl font-bold tracking-tight">Live Vitals</h2>
       <div className="grid gap-6 sm:grid-cols-2">
        <DataCard
          title="Heart Rate"
          value={heartRate}
          unit="BPM"
          icon={HeartPulse}
          description="Beats per minute from your device."
        />
        <DataCard
          title="Oxygen Saturation"
          value={spo2}
          unit="SpO2 %"
          icon={Waves}
          description="Blood oxygen level."
        />
      </div>
    </div>
  );
}
