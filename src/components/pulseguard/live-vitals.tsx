'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Heart, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export function LiveVitals() {
    const [data, setData] = useState({ heartRate: 0, pulse: 0 }); // pulse mapped to SpO2
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchVitals = useCallback(async () => {
        try {
            const res = await fetch('/api/vitals');
            if (res.ok) {
                const jsonData = await res.json();
                setData({ heartRate: jsonData.heartRate, pulse: jsonData.pulse });
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
        <Card className="h-full border-sidebar-border bg-card shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium tracking-tight flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Live Patient Vitals
                </CardTitle>
                <span className="text-xs text-muted-foreground tabular-nums">
                    Updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : '--:--:--'}
                </span>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
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
                    <div className={`h-3 w-3 rounded-full ${data.heartRate > 0 ? 'bg-green-500 animate-ping' : 'bg-gray-500'}`} />
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
                    <div className="text-xs px-2 py-1 rounded bg-background border">
                        Normal: 95-100%
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
