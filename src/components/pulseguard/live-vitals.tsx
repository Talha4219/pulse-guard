'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Heart, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export function LiveVitals() {
    const [data, setData] = useState({ heartRate: 0, pulse: 0, temperature: 0, humidity: 0 }); // pulse mapped to SpO2
    const [emergency, setEmergency] = useState({ active: false, message: '', timestamp: '' });
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchVitals = useCallback(async () => {
        try {
            const res = await fetch('/api/vitals');
            if (res.ok) {
                const jsonData = await res.json();
                setData({
                    heartRate: jsonData.heartRate,
                    pulse: jsonData.pulse,
                    temperature: jsonData.temperature || 0,
                    humidity: jsonData.humidity || 0
                });
                if (jsonData.emergency) {
                    setEmergency(jsonData.emergency);
                }
                setLastUpdated(new Date());
            }
        } catch (e) {
            console.error("Fetch error", e);
        }
    }, []);

    useEffect(() => {
        fetchVitals();
        const interval = setInterval(fetchVitals, 2000); // 2s polling
        return () => clearInterval(interval);
    }, [fetchVitals]);

    return (
        <Card className={`h-full border-sidebar-border bg-card shadow-sm relative overflow-hidden ${emergency.active ? 'border-red-600 border-2' : ''}`}>

            {/* Emergency Overlay */}
            {emergency.active && (
                <div className="absolute inset-0 bg-red-600/90 z-50 flex flex-col items-center justify-center text-white animate-in fade-in duration-300">
                    <div className="p-4 bg-white/10 rounded-full mb-4 animate-bounce">
                        <AlertTriangle className="h-12 w-12" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter mb-2">EMERGENCY DETECTED</h2>
                    <p className="text-xl font-medium px-6 text-center">{emergency.message}</p>
                    <p className="text-sm opacity-80 mt-4">
                        Time: {emergency.timestamp ? new Date(emergency.timestamp).toLocaleTimeString() : 'Just now'}
                    </p>
                    <button
                        onClick={async () => {
                            // Clear emergency button (optional, usually done by clearing from source or separate ack)
                            // For now, let's just create an API call to clear it if the doctor wants
                            await fetch('/api/emergency', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ status: 'cleared' })
                            });
                            // Store update will reflect on next poll
                        }}
                        className="mt-8 px-6 py-2 bg-white text-red-600 rounded-full font-bold hover:bg-red-50 transition-colors"
                    >
                        ACKNOWLEDGE & CLEAR
                    </button>
                </div>
            )}

            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium tracking-tight flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Live Patient Vitals
                </CardTitle>
                <span className="text-xs text-muted-foreground tabular-nums">
                    Updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : '--:--:--'}
                </span>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
                {/* Heart Rate Display */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-red-500/10 rounded-full text-red-500">
                            <Heart className="h-6 w-6 animate-pulse" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Heart Rate</p>
                            <p className="text-3xl font-bold tracking-tighter text-foreground tabular-nums">
                                {data.heartRate} <span className="text-sm font-normal text-muted-foreground">BPM</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Pulse / SpO2 Display */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-500/10 rounded-full text-blue-500">
                            <Activity className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Pulse / SpO2</p>
                            <p className="text-3xl font-bold tracking-tighter text-foreground tabular-nums">
                                {data.pulse} <span className="text-sm font-normal text-muted-foreground">%</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Temperature & Humidity Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Temperature */}
                    <div className="p-3 rounded-xl bg-secondary/30 border border-border flex flex-col items-center justify-center text-center">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Temperature</p>
                        <p className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
                            {data.temperature}°C
                        </p>
                    </div>

                    {/* Humidity */}
                    <div className="p-3 rounded-xl bg-secondary/30 border border-border flex flex-col items-center justify-center text-center">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Humidity</p>
                        <p className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
                            {data.humidity}%
                        </p>
                    </div>
                </div>

                <div className="pt-4 flex justify-center">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <RefreshCw className="h-3 w-3 animate-spin duration-[3000ms]" />
                        Syncing with ESP32...
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
