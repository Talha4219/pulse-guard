# **App Name**: PulseGuard

## Core Features:

- Data Display: Display heartbeat and pulse data received from the ESP32 device on the main page, using the data sent to the API endpoint.
- Alarm Setting: Allow users to set an alarm time via the app's interface, which is then sent to the ESP32 device via API request. Use a tool to help decide whether to display alarms based on changes in heart rate, and alarm severity based on these changes.
- API Endpoint: Provide an API endpoint for the ESP32 device to send heartbeat and pulse data to the app and receives commands from the user (such as alarm settings).

## Style Guidelines:

- Primary color: Deep sky blue (#43A6DF) for a calm, reliable feel, reflecting the app's monitoring purpose.
- Background color: Light gray (#E9ECEF), providing a clean, unobtrusive backdrop for the vital data.
- Accent color: Soft orange (#EFA171) to highlight alarm settings and critical information.
- Body and headline font: 'Inter' (sans-serif) for a modern, easily readable interface.
- Use clear, minimalist icons to represent heartbeat, pulse, and alarm functions.
- Data display should be prominent and easily readable.
- Subtle animations to indicate real-time data updates from the ESP32.