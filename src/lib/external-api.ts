import { IAppointment } from '@/models/Appointment';

export async function forwardAppointmentToExternalApi(appointment: IAppointment) {
    // Simulate external API call
    console.log('Forwarding appointment to external API:', appointment);

    // In a real scenario, this would be a fetch call to another server
    // await fetch('https://external-api.com/appointments', { ... });

    return new Promise((resolve) => setTimeout(resolve, 1000));
}
