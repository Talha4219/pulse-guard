'use client';

import { useEffect, useState, useCallback } from 'react';
import { useActionState } from 'react';
import { CalendarPlus, Loader2, CheckCircle, Clock } from 'lucide-react';
import { handleCreateAppointment, type FormState } from '@/app/actions'; // We might need a new action for approval
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface AppointmentFormProps {
    onAppointmentCreated?: () => void;
}

interface PendingAppointment {
    _id: string;
    patient: string;
    doctor: string;
    time?: string;
    status: 'pending';
}

export function AppointmentForm({ onAppointmentCreated }: AppointmentFormProps) {
    const { toast } = useToast();
    const [pendingAppointments, setPendingAppointments] = useState<PendingAppointment[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedTimes, setSelectedTimes] = useState<Record<string, string>>({});

    const fetchPending = useCallback(async () => {
        try {
            const res = await fetch('/api/appointment');
            if (res.ok) {
                const data = await res.json();
                // Filter only pending
                const pending = Array.isArray(data) ? data.filter((a: any) => a.status === 'pending') : [];
                setPendingAppointments(pending);
            }
        } catch (e) {
            console.error("Failed to fetch pending", e);
        }
    }, []);

    useEffect(() => {
        fetchPending();
        const interval = setInterval(fetchPending, 5000);
        return () => clearInterval(interval);
    }, [fetchPending]);

    const handleApprove = async (id: string, patient: string) => {
        const time = selectedTimes[id];
        if (!time) {
            toast({ title: 'Error', description: 'Please select a time for the appointment.', variant: 'destructive' });
            return;
        }

        setLoading(true);
        try {
            // Call API to update status to scheduled and set time
            const res = await fetch('/api/appointment', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: 'scheduled', time })
            });

            if (res.ok) {
                toast({ title: 'Success', description: `Appointment for ${patient} scheduled at ${time}.` });
                fetchPending(); // Refresh list

                // Clear time selection
                const newTimes = { ...selectedTimes };
                delete newTimes[id];
                setSelectedTimes(newTimes);

                if (onAppointmentCreated) onAppointmentCreated(); // Refresh main card
            } else {
                toast({ title: 'Error', description: 'Failed to approve appointment.', variant: 'destructive' });
            }
        } catch (e) {
            console.error(e);
            toast({ title: 'Error', description: 'Something went wrong.', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className='space-y-4'
        >
            {/* Pending Requests Section */}
            <AnimatePresence>
                {pendingAppointments.length > 0 && (
                    <Card className="shadow-2xl border-yellow-500/30 bg-yellow-500/10 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl text-yellow-500">
                                <Clock className="w-5 h-5" />
                                Pending Requests ({pendingAppointments.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {pendingAppointments.map((appt) => (
                                <div key={appt._id} className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/5">
                                    <div className="text-sm flex-1">
                                        <p className="text-white font-medium">{appt.patient}</p>
                                        <p className="text-white/60 text-xs">Dr. {appt.doctor}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="time"
                                            className="w-32 bg-black/20 border-white/10 h-8"
                                            value={selectedTimes[appt._id] || ''}
                                            onChange={(e) => setSelectedTimes({ ...selectedTimes, [appt._id]: e.target.value })}
                                        />
                                        <Button
                                            size="sm"
                                            variant="glow"
                                            disabled={loading}
                                            onClick={() => handleApprove(appt._id, appt.patient)}
                                        >
                                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4 text-green-400" />}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}
            </AnimatePresence>


        </motion.div>
    );
}
