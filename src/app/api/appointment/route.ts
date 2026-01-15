import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Appointment from '@/models/Appointment';
import { forwardAppointmentToExternalApi } from '@/lib/external-api';

export async function GET() {
    try {
        await connectDB();
        // Fetch pending appointments first, or just all of them sorted by status
        const appointments = await Appointment.find({}).sort({ createdAt: -1 }); // Get all
        return NextResponse.json(appointments);
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
        if (!body.patient || !body.doctor) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // New requests via API are 'pending' by default
        const newAppointment = await Appointment.create({
            ...body,
            status: 'pending'
        });

        return NextResponse.json(newAppointment, { status: 201 });
    } catch (error) {
        console.error('Failed to create appointment request:', error);
        return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        await connectDB();
        const body = await request.json();

        if (!body.id || !body.status) {
            return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
        }

        // If scheduling, require time
        if (body.status === 'scheduled' && !body.time) {
            return NextResponse.json({ error: 'Time is required to schedule' }, { status: 400 });
        }

        const appointment = await Appointment.findById(body.id);
        if (!appointment) {
            return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
        }

        appointment.status = body.status;
        if (body.time) {
            appointment.time = body.time;
        }
        await appointment.save();

        // If status is scheduled, forward to external API
        if (body.status === 'scheduled') {
            await forwardAppointmentToExternalApi(appointment);
        }

        return NextResponse.json(appointment);

    } catch (error) {
        console.error('Failed to update appointment:', error);
        return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
    }
}
