import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Appointment from '@/models/Appointment';

export async function GET() {
    try {
        await connectDB();
        // Fetch the latest appointment, or all of them. 
        // For the appointment block, we might just want the upcoming one.
        // Let's sort by time or creation.
        const appointments = await Appointment.find({}).sort({ createdAt: -1 }).limit(1);

        return NextResponse.json(appointments[0] || null);
    } catch (error) {
        console.error('Failed to fetch appointments:', error);
        return NextResponse.json({ error: 'Failed to fetch appointment' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();

        // Validate body
        if (!body.patient || !body.doctor || !body.time) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newAppointment = await Appointment.create(body);

        return NextResponse.json(newAppointment, { status: 201 });
    } catch (error) {
        console.error('Failed to create appointment:', error);
        return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
    }
}
