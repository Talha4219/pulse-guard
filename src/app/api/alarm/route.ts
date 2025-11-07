import { NextResponse } from 'next/server';
import { getAlarm, setAlarm } from '@/lib/store';

// Endpoint for ESP32 to GET the current alarm setting
export async function GET() {
  const alarm = getAlarm();
  return NextResponse.json(alarm);
}

// Endpoint for the web app to POST a new alarm setting
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { time } = body;

    if (typeof time !== 'string' || !/^\d{2}:\d{2}$/.test(time)) {
      return NextResponse.json({ error: 'Invalid time format. Use HH:MM' }, { status: 400 });
    }

    setAlarm({ time });
    console.log('Alarm set for ESP32:', { time });

    return NextResponse.json({ message: 'Alarm set successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
