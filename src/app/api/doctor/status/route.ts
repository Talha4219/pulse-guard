import { NextResponse } from 'next/server';
import { getDoctorStatus, setDoctorStatus } from '@/lib/store';

// Endpoint for ESP32 to GET the current doctor status
export async function GET() {
  const status = getDoctorStatus();
  return NextResponse.json({ status });
}


// Endpoint for the web app to POST the doctor's status ('coming' or 'idle')
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { status } = body;

    if (status === 'coming' || status === 'idle') {
      setDoctorStatus(status);
      console.log(`Doctor status set to: ${status}`);
      return NextResponse.json({ message: `Doctor status set to ${status}` }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Invalid status. Use "coming" or "idle"' }, { status: 400 });
    }

  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
