'use client';

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { AlarmClock, Bot, BrainCircuit, AlertTriangle, Loader2 } from 'lucide-react';
import { handleSetAlarm, type FormState } from '@/app/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';

interface AlarmFormProps {
  currentHeartRate: number;
  historicalHeartRates: number[];
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
          Analyzing & Setting...
        </>
      ) : (
        <>
          <Bot className="mr-2 h-4 w-4" />
          Set with AI Assist
        </>
      )}
    </Button>
  );
}

export function AlarmForm({ currentHeartRate, historicalHeartRates }: AlarmFormProps) {
  const [state, formAction] = useActionState(handleSetAlarm, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.isError ? 'Error' : 'Success',
        description: state.message,
        variant: state.isError ? 'destructive' : 'default',
      });
    }
  }, [state, toast]);
  
  const severityMap = {
    low: { variant: "secondary", label: "Low" },
    medium: { variant: "default", className: "bg-yellow-500 text-black", label: "Medium" },
    high: { variant: "destructive", label: "High" },
  } as const;


  return (
    <Card className="shadow-md transition-shadow hover:shadow-lg">
      <form action={formAction}>
        <input type="hidden" name="currentHeartRate" value={currentHeartRate} />
        <input type="hidden" name="historicalHeartRates" value={historicalHeartRates.join(',')} />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlarmClock className="h-6 w-6 text-primary" />
            Set Alarm
          </CardTitle>
          <CardDescription>
            Enter your desired wake-up time. Our AI will analyze your heart rate patterns to suggest smart alarm parameters.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="alarmTime">Alarm Time</Label>
            <Input id="alarmTime" name="alarmTime" type="time" defaultValue="07:00" required />
            {state.errors?.alarmTime && (
              <p className="text-sm font-medium text-destructive">{state.errors.alarmTime[0]}</p>
            )}
          </div>
          {state.aiResponse && (
            <div className="space-y-4 rounded-lg border bg-accent/30 p-4">
               <h3 className="font-semibold flex items-center gap-2"><BrainCircuit className="h-5 w-5 text-primary" /> AI Recommendation</h3>
               <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex flex-col space-y-1">
                      <span className="text-muted-foreground">HR Threshold</span>
                      <span className="font-bold text-lg">{Math.round(state.aiResponse.alarmThreshold)} BPM</span>
                  </div>
                  <div className="flex flex-col space-y-1">
                      <span className="text-muted-foreground">Alarm Severity</span>
                      <Badge 
                        variant={severityMap[state.aiResponse.alarmSeverity].variant}
                        className={severityMap[state.aiResponse.alarmSeverity].className}
                      >
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        {severityMap[state.aiResponse.alarmSeverity].label}
                      </Badge>
                  </div>
               </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
