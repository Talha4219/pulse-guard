import { NextResponse } from 'next/server';
import { getLatestVitals, updateVitals, getStore } from '@/lib/store';

// Endpoint for ESP32 to GET latest data (less common, but for completeness)
export async function GET() {
  const store = getStore();
  return NextResponse.json({
    ...store.latestVitals,
    emergency: store.emergency
  });
}

// Endpoint for ESP32 to POST new data
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { heartRate, pulse, temperature, humidity } = body;

    // Optional: Validate types if needed, or default them to 0 if missing
    // if (typeof heartRate !== 'number' || typeof pulse !== 'number') {
    //   return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    // }

    updateVitals({
      heartRate: heartRate || 0,
      pulse: pulse || 0,
      temperature: temperature || 0,
      humidity: humidity || 0
    });
    console.log('Received vitals from ESP32:', { heartRate, pulse, temperature, humidity });

    return NextResponse.json({ message: 'Data received successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
