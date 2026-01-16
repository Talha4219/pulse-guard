import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        console.log('--- FINAL APPOINTMENT RECEIVED ---');
        console.log(JSON.stringify(body, null, 2));
        console.log('----------------------------------');

        return NextResponse.json({ success: true, message: 'Appointment received at destination' });
    } catch (error) {
        console.error('Destination API Error:', error);
        return NextResponse.json({ error: 'Failed to process data' }, { status: 500 });
    }
}
