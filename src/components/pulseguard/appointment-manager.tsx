'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Check, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface AppointmentType {
    _id: string;
    patient: string;
    doctor: string;
    status: 'pending' | 'scheduled' | 'completed';
    time?: string;
}

export function AppointmentManager() {
    const { toast } = useToast();
    const [appointments, setAppointments] = useState<AppointmentType[]>([]);
    const [date, setDate] = useState<Date>();
    const [time, setTime] = useState<string>();
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const fetchAppointments = useCallback(async () => {
        try {
            const res = await fetch('/api/appointment');
            if (res.ok) {
                const data = await res.json();
                setAppointments(data);
            }
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        fetchAppointments();
        const interval = setInterval(fetchAppointments, 5000);
        return () => clearInterval(interval);
    }, [fetchAppointments]);

    const handleSchedule = async (id: string) => {
        if (!date || !time) {
            toast({ title: "Incomplete", description: "Select date and time first.", variant: "destructive" });
            return;
        }

        const formattedDate = format(date, 'yyyy-MM-dd');
        const finalTime = `${formattedDate} ${time}`;

        try {
            const res = await fetch('/api/appointment', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: 'scheduled', time: finalTime })
            });

            if (res.ok) {
                toast({ title: "Scheduled", description: "Appointment confirmed/sent to device." });
                setSelectedId(null);
                setDate(undefined);
                setTime(undefined);
                fetchAppointments();
            }
        } catch (e) {
            toast({ title: "Error", description: "Connection failed.", variant: "destructive" });
        }
    };

    const pendingList = appointments.filter(a => a.status === 'pending');
    const scheduledList = appointments.filter(a => a.status === 'scheduled');

    return (
        <Card className="h-full border-sidebar-border bg-card shadow-sm flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Appointment Center
                </CardTitle>
                <CardDescription>Manage incoming requests from patient devices.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-6 overflow-y-auto pr-2">

                {/* Pending Section */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Incoming Requests ({pendingList.length})</h3>
                    {pendingList.length === 0 && (
                        <div className="p-4 border border-dashed rounded-lg text-center text-muted-foreground text-sm">
                            No pending requests.
                        </div>
                    )}
                    {pendingList.map(appt => (
                        <div key={appt._id} className="p-4 rounded-xl border bg-secondary/20 space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-foreground flex items-center gap-2">
                                        <User className="h-4 w-4 text-primary" />
                                        {appt.patient}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Requesting Dr. {appt.doctor}</p>
                                </div>
                                <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600 text-[10px] font-bold uppercase">
                                    Pending Action
                                </span>
                            </div>

                            {/* Scheduling Controls */}
                            <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            size="sm"
                                            className={cn("sm:col-span-3 justify-start text-left font-normal h-8", !date && "text-muted-foreground")}
                                        >
                                            <CalendarIcon className="mr-2 h-3 w-3" />
                                            {date ? format(date, "MMM dd") : <span>Date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                                    </PopoverContent>
                                </Popover>

                                <Select value={time} onValueChange={setTime}>
                                    <SelectTrigger className="sm:col-span-2 h-8">
                                        <SelectValue placeholder="Time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"].map(t => (
                                            <SelectItem key={t} value={t}>{t}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Button size="sm" className="sm:col-span-2 h-8" onClick={() => handleSchedule(appt._id)}>
                                    <Check className="h-3 w-3 mr-1" /> Confirm
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Scheduled Section */}
                <div className="space-y-3 pt-4 border-t">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Confirmed Schedule</h3>
                    {scheduledList.map(appt => (
                        <div key={appt._id} className="flex justify-between items-center p-3 rounded-lg border bg-background">
                            <div className="text-sm">
                                <span className="font-medium">{appt.patient}</span>
                                <span className="text-muted-foreground mx-2">•</span>
                                <span className="text-primary font-semibold">{appt.time}</span>
                            </div>
                            <div className="h-2 w-2 rounded-full bg-green-500" title="Sent to Device" />
                        </div>
                    ))}
                    {scheduledList.length === 0 && (
                        <p className="text-xs text-muted-foreground pl-1">No confirmed appointments yet.</p>
                    )}
                </div>

            </CardContent>
        </Card>
    );
}
