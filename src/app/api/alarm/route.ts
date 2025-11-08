import { NextResponse } from 'next/server';
import { getAlarm, setAlarm } from '@/lib/store';

// Endpoint for ESP32 or web app to GET the current alarm setting
export async function GET() {
  const alarm = getAlarm();
  return NextResponse.json(alarm);
}

// Endpoint for the web app or ESP32 to POST a new alarm setting
// ESP32 should send a JSON body like: { "time": "HH:MM" }
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { time } = body;

    // Allow time to be set to null to clear the alarm
    if (time !== null && (typeof time !== 'string' || !/^\d{2}:\d{2}$/.test(time))) {
      return NextResponse.json({ error: 'Invalid time format. Use HH:MM or null' }, { status: 400 });
    }

    setAlarm({ time });
    console.log('Alarm set:', { time });

    return NextResponse.json({ message: 'Alarm set successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
