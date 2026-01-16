'use client';

import { motion, AnimatePresence } from 'framer-motion';

import { useEffect, useState, useCallback } from 'react';
import { useActionState } from 'react';
import { CalendarPlus, Loader2, CheckCircle, Clock } from 'lucide-react';
import { handleCreateAppointment, type FormState } from '@/app/actions'; // We might need a new action for approval
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    const [selectedDates, setSelectedDates] = useState<Record<string, Date | undefined>>({});
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
        const date = selectedDates[id];
        const time = selectedTimes[id];

        if (!date || !time) {
            toast({ title: 'Error', description: 'Please select both date and time.', variant: 'destructive' });
            return;
        }

        const formattedDate = format(date, 'yyyy-MM-dd');
        const finalDateTime = `${formattedDate} ${time}`;

        setLoading(true);
        try {
            // Call API to update status to scheduled and set time
            const res = await fetch('/api/appointment', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: 'scheduled', time: finalDateTime })
            });

            if (res.ok) {
                toast({ title: 'Success', description: `Appointment for ${patient} scheduled at ${time}.` });
                fetchPending(); // Refresh list

                // Clear selection
                const newTimes = { ...selectedTimes };
                const newDates = { ...selectedDates };
                delete newTimes[id];
                delete newDates[id];
                setSelectedTimes(newTimes);
                setSelectedDates(newDates);

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
                {pendingAppointments.length > 0 ? (
                    <Card className="shadow-sm border-l-4 border-l-primary bg-card">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center justify-between text-base font-medium text-foreground">
                                <span className="flex items-center gap-2">
                                    <div className="relative">
                                        <div className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse border border-background" />
                                        <Clock className="w-4 h-4 text-primary" />
                                    </div>
                                    Incoming Requests
                                </span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                    {pendingAppointments.length} New
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {pendingAppointments.map((appt) => (
                                <div key={appt._id} className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-md bg-secondary/30 border border-transparent hover:border-sidebar-border transition-all gap-3">
                                    <div className="space-y-1 w-full sm:w-auto">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-sm">{appt.patient}</span>
                                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">Pending</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">Requested for Dr. {appt.doctor}</p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    size="sm"
                                                    className={cn(
                                                        "w-[130px] justify-start text-left font-normal h-8 text-xs",
                                                        !selectedDates[appt._id] && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-3 w-3" />
                                                    {selectedDates[appt._id] ? format(selectedDates[appt._id]!, "MMM dd") : <span>Set Date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="end">
                                                <Calendar
                                                    mode="single"
                                                    selected={selectedDates[appt._id]}
                                                    onSelect={(date) => setSelectedDates({ ...selectedDates, [appt._id]: date })}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>

                                        <Select onValueChange={(val) => setSelectedTimes({ ...selectedTimes, [appt._id]: val })}>
                                            <SelectTrigger className="w-[100px] flex-1 md:flex-none h-8 bg-background border-input">
                                                <SelectValue placeholder="Time" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="09:00">09:00</SelectItem>
                                                <SelectItem value="10:00">10:00</SelectItem>
                                                <SelectItem value="11:00">11:00</SelectItem>
                                                <SelectItem value="12:00">12:00</SelectItem>
                                                <SelectItem value="13:00">13:00</SelectItem>
                                                <SelectItem value="14:00">14:00</SelectItem>
                                                <SelectItem value="15:00">15:00</SelectItem>
                                                <SelectItem value="16:00">16:00</SelectItem>
                                                <SelectItem value="17:00">17:00</SelectItem>
                                            </SelectContent>
                                        </Select>

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
                ) : (
                    <Card className="border-sidebar-border border-dashed bg-card/50">
                        <CardContent className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground space-y-2">
                            <div className="p-3 rounded-full bg-secondary/50">
                                <Clock className="h-5 w-5 opacity-50" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-foreground">No New Requests</p>
                                <p className="text-xs">Patient appointment requests will appear here.</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </AnimatePresence>


        </motion.div>
    );
}
