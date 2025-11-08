'use client';

import { useEffect, useRef } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { AlarmClock, Loader2 } from 'lucide-react';
import { handleSetAlarm, type FormState } from '@/app/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface AlarmFormProps {
  currentHeartRate: number;
  historicalHeartRates: number[];
  onAlarmSet: () => void;
}

const initialState: FormState = {
  message: '',
  isError: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Setting Reminder...
        </>
      ) : (
        <>
          <AlarmClock className="mr-2 h-4 w-4" />
          Set Reminder
        </>
      )}
    </Button>
  );
}

export function AlarmForm({ onAlarmSet }: AlarmFormProps) {
  const [state, formAction] = useActionState(handleSetAlarm, initialState);
  const { toast } = useToast();
  const prevStateRef = useRef<FormState>(initialState);

  useEffect(() => {
    if (state.message && state !== prevStateRef.current) {
      toast({
        title: state.isError ? 'Error' : 'Success',
        description: state.message,
        variant: state.isError ? 'destructive' : 'default',
      });
      if (!state.isError) {
        onAlarmSet();
      }
      prevStateRef.current = state;
    }
  }, [state, toast, onAlarmSet]);


  return (
    <Card className="shadow-md transition-shadow hover:shadow-lg">
      <form action={formAction}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlarmClock className="h-6 w-6 text-primary" />
            Set Medicine Reminder
          </CardTitle>
          <CardDescription>
            Enter the time you need to take your medication.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="alarmTime">Reminder Time</Label>
            <Input id="alarmTime" name="alarmTime" type="time" defaultValue="09:00" required />
            {state.errors?.alarmTime && (
              <p className="text-sm font-medium text-destructive">{state.errors.alarmTime[0]}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
