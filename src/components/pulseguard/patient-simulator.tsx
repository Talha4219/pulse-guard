'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Smartphone, CalendarPlus, Activity, AlertTriangle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateVitals } from '@/lib/store'; // We can't use server actions directly for store if it's in lib/store (in-memory), but we should use API.

export function PatientSimulator() {
    const { toast } = useToast();
    const [loading, setLoading] = useState<string | null>(null);

    // Simulation Data
    const [patientName, setPatientName] = useState('John Doe');
    const [emergencyType, setEmergencyType] = useState('Heart Rate High');

    const simulateAppointmentRequest = async () => {
        setLoading('appt');
        try {
            // User requested ID "1234" for the example
            const customKey = "1234";

            const res = await fetch('/api/appointment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    key: customKey,
                    patient: "Farzan", // User specific name
                    doctor: "Talha Shams", // User specific name
                    status: 'pending'
                })
            });

            if (res.ok) {
                const data = await res.json();
                const trackingKey = customKey;

                toast({ title: 'Request Sent', description: `Key: ${trackingKey}. Waiting for confirmation...` });

                // Simulate ESP32 Polling logic
                const pollInterval = setInterval(async () => {
                    try {
                        const checkRes = await fetch(`/api/appointment?key=${trackingKey}`);
                        if (checkRes.ok) {
                            const checkData = await checkRes.json();
                            if (checkData.status === 'scheduled') {
                                toast({
                                    title: 'APPOINTMENT CONFIRMED!',
                                    description: `Doctor scheduled for: ${checkData.time}`,
                                    className: "bg-green-500 text-white"
                                });
                                clearInterval(pollInterval);
                            }
                        }
                    } catch (e) {
                        console.error("Polling error", e);
                    }
                }, 3000); // Check every 3 seconds

                // Stop polling after 60 seconds to avoid infinite loops in demo
                setTimeout(() => clearInterval(pollInterval), 60000);

            } else {
                toast({ title: 'Error', description: 'Failed to send signal.', variant: 'destructive' });
            }
        } catch (e) {
            toast({ title: 'Error', description: 'Connection failed.', variant: 'destructive' });
        } finally {
            setLoading(null);
        }
    };

    const simulateVitalsUpdate = async (type: 'normal' | 'emergency') => {
        setLoading(type);
        try {
            // Construct payload based on type
            // Construct payloads
            const vitalsPayload = type === 'normal'
                ? { heartRate: 75, pulse: 98 }
                : { heartRate: 140, pulse: 88 };

            const dhtPayload = type === 'normal'
                ? { temperature: 36.5, humidity: 45 }
                : { temperature: 38.2, humidity: 55 };

            // Send Vitals (Heart/Pulse)
            const vitalsRes = await fetch('/api/vitals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(vitalsPayload)
            });

            // Send Environment (Temp/Humidity)
            const dhtRes = await fetch('/api/dht', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dhtPayload)
            });

            if (vitalsRes.ok && dhtRes.ok) {
                toast({
                    title: type === 'emergency' ? 'EMERGENCY SIGNAL SENT' : 'Vitals & Environment Updated',
                    description: 'ESP32 sent separate sensor data streams.',
                    variant: type === 'emergency' ? 'destructive' : 'default'
                });
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(null);
        }
    };

    return (
        <Card className="border-sidebar-border bg-card/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-medium">
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                    Patient Device Simulator (ESP32)
                </CardTitle>
                <CardDescription>
                    Simulate signals from the patient's wearable device.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">

                <div className="space-y-2">
                    <Label>Actions</Label>
                    <div className="grid grid-cols-3 gap-2">
                        <Button
                            variant="outline"
                            className="h-auto py-2 flex flex-col gap-1 items-start"
                            onClick={simulateAppointmentRequest}
                            disabled={!!loading}
                        >
                            <span className="flex items-center gap-2 text-primary font-semibold">
                                {loading === 'appt' ? <Loader2 className="h-3 w-3 animate-spin" /> : <CalendarPlus className="h-3 w-3" />}
                                Request Appt
                            </span>
                            <span className="text-xs text-muted-foreground sr-only sm:not-sr-only">Sends "pending" request</span>
                        </Button>

                        <Button
                            variant="outline"
                            className="h-auto py-2 flex flex-col gap-1 items-start border-red-900/20 hover:bg-red-900/10 hover:text-red-500"
                            onClick={async () => {
                                setLoading('emergency');
                                try {
                                    await fetch('/api/emergency', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            status: true,
                                            patient: 'John Doe',
                                            address: '123 Main St, New York, NY'
                                        })
                                    });
                                    toast({ title: 'SOS SENT', description: 'Emergency API triggered', variant: 'destructive' });
                                } catch (e) { console.error(e); }
                                setLoading(null);
                            }}
                            disabled={!!loading}
                        >
                            <span className="flex items-center gap-2 text-red-500 font-semibold">
                                {loading === 'emergency' ? <Loader2 className="h-3 w-3 animate-spin" /> : <AlertTriangle className="h-3 w-3" />}
                                Trigger SOS
                            </span>
                            <span className="text-xs text-muted-foreground sr-only sm:not-sr-only">Simulate Fall</span>
                        </Button>

                        <Button
                            variant="outline"
                            className="h-auto py-2 flex flex-col gap-1 items-start border-blue-900/20 hover:bg-blue-900/10 hover:text-blue-500"
                            onClick={async () => {
                                setLoading('custom');
                                try {
                                    await fetch('/api/vitals', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ heartRate: 34, pulse: 22 })
                                    });
                                    await fetch('/api/dht', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ temperature: 35.0, humidity: 40 })
                                    });
                                    toast({ title: 'Custom Data Sent', description: 'HR: 34, Pulse: 22, Temp: 35' });
                                } catch (e) { console.error(e); }
                                setLoading(null);
                            }}
                            disabled={!!loading}
                        >
                            <span className="flex items-center gap-2 text-blue-500 font-semibold">
                                {loading === 'custom' ? <Loader2 className="h-3 w-3 animate-spin" /> : <Activity className="h-3 w-3" />}
                                Test Low
                            </span>
                            <span className="text-xs text-muted-foreground sr-only sm:not-sr-only">Send HR:34/P:22</span>
                        </Button>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-muted-foreground text-xs h-6"
                        onClick={() => simulateVitalsUpdate('normal')}
                        disabled={!!loading}
                    >
                        Reset to Normal Vitals
                    </Button>
                </div>

            </CardContent>
        </Card >
    );
}
