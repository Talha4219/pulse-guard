import { NextResponse } from 'next/server';
import { getLatestVitals, updateVitals } from '@/lib/store';

// Endpoint for ESP32 to GET latest data (less common, but for completeness)
export async function GET() {
  const vitals = getLatestVitals();
  return NextResponse.json(vitals);
}

// Endpoint for ESP32 to POST new data
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { heartRate, pulse } = body;

    if (typeof heartRate !== 'number' || typeof pulse !== 'number') {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    updateVitals({ heartRate, pulse });
    console.log('Received vitals from ESP32:', { heartRate, pulse });

    return NextResponse.json({ message: 'Data received successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
