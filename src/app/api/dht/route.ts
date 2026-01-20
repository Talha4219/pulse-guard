import { NextResponse } from 'next/server';
import { updateVitals } from '@/lib/store';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { temperature, humidity } = body;

        // Update only temperature and humidity in the store
        updateVitals({
            temperature: temperature || 0,
            humidity: humidity || 0
        });
        console.log('Received DHT data:', { temperature, humidity });

        return NextResponse.json({ message: 'DHT Data received successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to process data' }, { status: 500 });
    }
}
