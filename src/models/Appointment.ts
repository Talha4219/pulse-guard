import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAppointment extends Document {
    key?: string;
    patient: string;
    doctor: string;
    time?: string; // Storing as string 24h format "HH:MM", or ISO date string
    description?: string;
    status: 'pending' | 'scheduled';
    createdAt: Date;
}

const AppointmentSchema: Schema = new Schema({
    key: { type: String, unique: true, sparse: true, required: true }, // Custom Key from ESP32
    patient: { type: String, required: true },
    doctor: { type: String, required: true },
    time: { type: String },
    description: { type: String },
    status: { type: String, enum: ['pending', 'scheduled'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
});

// Prevent overwrite model error
// In development, we delete the model to force a schema refresh on hot reload
if (process.env.NODE_ENV === 'development' && mongoose.models.Appointment) {
    delete mongoose.models.Appointment;
}

const Appointment: Model<IAppointment> =
    mongoose.models.Appointment || mongoose.model<IAppointment>('Appointment', AppointmentSchema);

export default Appointment;
