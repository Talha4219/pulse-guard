'use client';

import { useEffect, useRef } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { CalendarPlus, Loader2 } from 'lucide-react';
import { handleCreateAppointment, type FormState } from '@/app/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface AppointmentFormProps {
    onAppointmentCreated?: () => void;
}

const initialState: FormState = {
    message: '',
    isError: false,
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button
            type="submit"
            disabled={pending}
            className="w-full relative overflow-hidden group"
            variant="glow"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scheduling...
                </>
            ) : (
                <>
                    <CalendarPlus className="mr-2 h-4 w-4" />
                    Schedule Appointment
                </>
            )}
        </Button>
    );
}

export function AppointmentForm({ onAppointmentCreated }: AppointmentFormProps) {
    const [state, formAction] = useActionState(handleCreateAppointment, initialState);
    const { toast } = useToast();
    const prevStateRef = useRef<FormState>(initialState);

    useEffect(() => {
        if (state.message && state !== prevStateRef.current) {
            toast({
                title: state.isError ? 'Error' : 'Success',
                description: state.message,
                variant: state.isError ? 'destructive' : 'default',
            });
            if (!state.isError && onAppointmentCreated) {
                onAppointmentCreated();
            }
            prevStateRef.current = state;
        }
    }, [state, toast, onAppointmentCreated]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
        >
            <Card className="shadow-2xl border-white/10 bg-card/40 backdrop-blur-xl">
                <form action={formAction}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl font-light">
                            <div className="p-2 rounded-full bg-primary/20 text-primary">
                                <CalendarPlus className="h-6 w-6" />
                            </div>
                            <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                                New Appointment
                            </span>
                        </CardTitle>
                        <CardDescription className="text-muted-foreground/80">
                            Schedule a visit with your doctor.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="patient" className="text-white/80">Patient Name</Label>
                            <Input
                                id="patient"
                                name="patient"
                                placeholder="e.g. John Doe"
                                required
                                className="bg-black/20 border-white/10"
                            />
                            {state.errors?.patient && (
                                <p className="text-sm font-medium text-destructive">{state.errors.patient[0]}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="doctor" className="text-white/80">Doctor Name</Label>
                            <Input
                                id="doctor"
                                name="doctor"
                                placeholder="e.g. Dr. House"
                                defaultValue="Dr. Farzan"
                                required
                                className="bg-black/20 border-white/10"
                            />
                            {state.errors?.doctor && (
                                <p className="text-sm font-medium text-destructive">{state.errors.doctor[0]}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="time" className="text-white/80">Time</Label>
                            <Input
                                id="time"
                                name="time"
                                type="time"
                                defaultValue="14:00"
                                required
                                className="bg-black/20 border-white/10"
                            />
                            {state.errors?.time && (
                                <p className="text-sm font-medium text-destructive">{state.errors.time[0]}</p>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <SubmitButton />
                    </CardFooter>
                </form>
            </Card>
        </motion.div>
    );
}
