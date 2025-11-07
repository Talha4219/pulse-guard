'use server';

import { z } from 'zod';
import { setAlarmWithAIRules, type AlarmSettingWithAIRulesOutput } from '@/ai/flows/alarm-rules';

const formSchema = z.object({
  alarmTime: z.string().regex(/^\d{2}:\d{2}$/, 'Please enter a valid time (HH:MM).'),
  currentHeartRate: z.coerce.number(),
  historicalHeartRates: z.string().transform(val => val.split(',').map(Number)),
});

export interface FormState {
  message: string;
  aiResponse?: AlarmSettingWithAIRulesOutput;
  errors?: {
    alarmTime?: string[];
  };
  isError?: boolean;
}

export async function handleSetAlarm(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = formSchema.safeParse({
    alarmTime: formData.get('alarmTime'),
    currentHeartRate: formData.get('currentHeartRate'),
    historicalHeartRates: formData.get('historicalHeartRates'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Failed to set alarm. Invalid data.',
      errors: validatedFields.error.flatten().fieldErrors,
      isError: true,
    };
  }
  
  const { alarmTime, currentHeartRate, historicalHeartRates } = validatedFields.data;

  try {
    console.log('Requesting AI analysis for alarm setting...');
    const aiResponse = await setAlarmWithAIRules({
      heartRate: currentHeartRate,
      historicalHeartRates,
      alarmTime,
    });

    console.log(`SIMULATING: Sending alarm time ${aiResponse.alarmTime} to ESP32.`);
    
    // In a real app, you would have the base URL in environment variables.
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';

    // This fetch call simulates the app server telling the ESP32 the new alarm time.
    // The ESP32 would need to poll an endpoint like this to get its configuration.
    await fetch(new URL('/api/alarm', baseUrl), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ time: aiResponse.alarmTime }),
    });

    return {
      message: `Alarm set for ${aiResponse.alarmTime}.`,
      aiResponse,
      isError: false,
    };
  } catch (error) {
    console.error('AI Flow Error:', error);
    return {
      message: 'An error occurred while getting AI recommendations.',
      isError: true,
    };
  }
}
