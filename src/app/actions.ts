'use server';

import { z } from 'zod';

const formSchema = z.object({
  alarmTime: z.string().regex(/^\d{2}:\d{2}$/, 'Please enter a valid time (HH:MM).'),
});

const appointmentSchema = z.object({
  patient: z.string().min(1, 'Patient name is required'),
  doctor: z.string().min(1, 'Doctor name is required'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Please enter a valid time (HH:MM).'),
});

export interface FormState {
  message: string;
  errors?: {
    alarmTime?: string[];
    patient?: string[];
    doctor?: string[];
    time?: string[];
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

export async function handleCreateAppointment(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = appointmentSchema.safeParse({
    patient: formData.get('patient'),
    doctor: formData.get('doctor'),
    time: formData.get('time'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Failed to create appointment. Invalid data.',
      errors: validatedFields.error.flatten().fieldErrors,
      isError: true,
    };
  }

  const { patient, doctor, time } = validatedFields.data;

  try {
    await fetch(new URL('/api/appointment', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patient, doctor, time }),
    });

    return {
      message: `Appointment scheduled with ${doctor} at ${time}.`,
      isError: false,
    };
  } catch (error) {
    console.error('Create Appointment Error:', error);
    return {
      message: 'Failed to create appointment.',
      isError: true,
    };
  }
}
