import { NextResponse } from 'next/server';
import { updateEmergency, getStore } from '@/lib/store';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        // Body format: { "status": "active" | "cleared", "message": "Fall Detected" }

        const isActive = body.status === 'active';

        updateEmergency({
            active: isActive,
            message: body.message || (isActive ? 'Emergency Alert' : ''),
            timestamp: isActive ? new Date().toISOString() : null
        });

        console.log('EMERGENCY UPDATE:', body);

        return NextResponse.json({ success: true, message: 'Emergency status updated' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update emergency' }, { status: 500 });
    }
}

export async function GET() {
    const store = getStore();
    return NextResponse.json(store.emergency);
}
