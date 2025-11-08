'use server';

import { z } from 'zod';

const formSchema = z.object({
  alarmTime: z.string().regex(/^\d{2}:\d{2}$/, 'Please enter a valid time (HH:MM).'),
});

export interface FormState {
  message: string;
  errors?: {
    alarmTime?: string[];
  };
  isError?: boolean;
}

export async function handleSetAlarm(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = formSchema.safeParse({
    alarmTime: formData.get('alarmTime'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Failed to set reminder. Invalid data.',
      errors: validatedFields.error.flatten().fieldErrors,
      isError: true,
    };
  }
  
  const { alarmTime } = validatedFields.data;

  try {
    // This fetch call tells the server to store the new alarm time.
    // The web app will then poll this to trigger the on-screen alarm.
    await fetch(new URL('/api/alarm', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ time: alarmTime }),
    });

    return {
      message: `Reminder set for ${alarmTime}.`,
      isError: false,
    };
  } catch (error) {
    console.error('Set Reminder Error:', error);
    return {
      message: 'An error occurred while setting the reminder.',
      isError: true,
    };
  }
}
