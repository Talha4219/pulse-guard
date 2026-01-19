import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Appointment from '@/models/Appointment';

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const key = searchParams.get('key');

        if (!key) {
            return NextResponse.json({ error: 'Key is required' }, { status: 400 });
        }

        const appointment = await Appointment.findOne({ key: key });

        if (!appointment) {
            return NextResponse.json({ error: 'Appointment not found at destination' }, { status: 404 });
        }

        return NextResponse.json({
            status: 'success',
            message: 'Data found at destination',
            time: appointment.time || 'pending',
            appointment_status: appointment.status,
            data: appointment
        });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}

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
