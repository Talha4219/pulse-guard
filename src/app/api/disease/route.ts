import { NextResponse } from 'next/server';
import { getLatestDisease, setLatestDisease } from '@/lib/store';

// Endpoint for the web app to GET the latest disease report
export async function GET() {
  const disease = getLatestDisease();
  return NextResponse.json(disease);
}

// Endpoint for ESP32 to POST a new disease report
// ESP32 should send a JSON body like: { "disease": "fever" }
// To clear the disease, send { "disease": null }
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { disease } = body;

    // Allow clearing the disease
    if (disease === null) {
      setLatestDisease({ name: null });
      console.log('Disease report cleared.');
      return NextResponse.json({ message: 'Disease report cleared successfully' }, { status: 200 });
    }

    if (typeof disease !== 'string' || disease.trim() === '') {
      return NextResponse.json({ error: 'Invalid data format. "disease" must be a non-empty string.' }, { status: 400 });
    }

    setLatestDisease({ name: disease });
    console.log('Disease reported:', { disease });

    return NextResponse.json({ message: 'Disease report received successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
