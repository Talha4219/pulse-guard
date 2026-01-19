import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Appointment from '@/models/Appointment';
// import { forwardAppointmentToExternalApi } from '@/lib/external-api'; // Removed mock

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const key = searchParams.get('key');
        const id = searchParams.get('id'); // Keep id just in case

        const searchKey = key || id;

        if (searchKey) {
            // Try finding by custom 'key' first
            const appointment = await Appointment.findOne({ key: searchKey });
            if (!appointment) {
                // Fallback: try finding by internal _id just in case
                try {
                    const byInternal = await Appointment.findById(searchKey);
                    if (byInternal) return NextResponse.json(byInternal);
                } catch (e) { }

                return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
            }
            return NextResponse.json(appointment);
        }

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
        console.log('--- POST /api/appointment Body:', body);

        // Validate body
        if (!body.patient || !body.doctor) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newAppointment = await Appointment.create({
            key: body.key, // Save custom Key if provided
            patient: body.patient,
            doctor: body.doctor,
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
        // If status is scheduled, forward to external API (Destination)
        if (body.status === 'scheduled') {
            try {
                await fetch(new URL('/api/destination', request.url), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(appointment)
                });
            } catch (err) {
                console.error("Forwarding failed", err);
            }
        }

        return NextResponse.json(appointment);

    } catch (error) {
        console.error('Failed to update appointment:', error);
        return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
    }
}
