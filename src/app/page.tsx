'use client';

import { LiveVitals } from '@/components/pulseguard/live-vitals';
import { AppointmentManager } from '@/components/pulseguard/appointment-manager';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <>
      <main className="flex-1 p-4 md:p-8 pt-6 h-[calc(100vh-4rem)] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full pb-8">
          {/* Column 1: Vitals (Wide on mobile, 4 cols on desk) */}
          <motion.div
            className="lg:col-span-5 h-full"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LiveVitals />
          </motion.div>

          {/* Column 2: Appointment Manager (Wide on mobile, 8 cols on desk) */}
          <motion.div
            className="lg:col-span-7 h-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AppointmentManager />
          </motion.div>
        </div>
      </main>
    </>
  );
}