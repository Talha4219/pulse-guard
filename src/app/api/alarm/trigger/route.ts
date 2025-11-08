import { NextResponse } from 'next/server';
import { getAlarmStatus, setAlarmStatus } from '@/lib/store';

// Endpoint for ESP32 to GET the current alarm status
export async function GET() {
  const status = getAlarmStatus();
  return NextResponse.json({ status });
}


// Endpoint for the web app to POST the alarm status ('ringing' or 'idle')
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { status } = body;

    if (status === 'ringing' || status === 'idle') {
      setAlarmStatus(status);
      console.log(`Alarm status set to: ${status}`);
      return NextResponse.json({ message: `Alarm status set to ${status}` }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Invalid status. Use "ringing" or "idle"' }, { status: 400 });
    }

  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}