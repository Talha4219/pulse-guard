import { NextResponse } from 'next/server';

// Endpoint for the web app to trigger the alarm on the ESP32
export async function POST() {
  // This endpoint's purpose is to be called by the web app when the alarm rings.
  // An ESP32 device could be polling this endpoint, and when it gets a successful
  // response, it knows to start its beeping/vibrating sequence.
  // For this simulation, we just log to the console.
  console.log('ALARM TRIGGERED: Sending beep signal to ESP32.');
  
  return NextResponse.json({ message: 'Alarm signal sent' }, { status: 200 });
}

export async function GET() {
    // A simple GET handler that an ESP32 could poll. 
    // The real logic is the POST request which acts as the trigger.
    // For a real-world scenario, you might use WebSockets, MQTT, or another
    // mechanism for more instant communication. Polling is simple for a demo.
    console.log("ESP32 is checking the alarm trigger endpoint.")
    return NextResponse.json({ status: 'listening' });
}
