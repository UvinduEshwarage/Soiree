import mongoose, { Schema, Document } from 'mongoose';

export interface ITicket extends Document {
  ticketId: string;
  name: string;
  email: string;
  phone: string;
  batch: string;
  indexNumber: string;
  ticketType: 'standard';
  price: number;
  paymentStatus: 'pending' | 'verified' | 'rejected';
  paymentSlip: string; // base64 or file path
  bankReference: string;
  qrCode: string;
  isUsed: boolean;
  usedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TicketSchema = new Schema<ITicket>(
  {
    ticketId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    batch: { type: String, required: true },
    indexNumber: { type: String, required: true },
    ticketType: { type: String, enum: ['standard'], default: 'standard' },
    price: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    paymentSlip: { type: String, default: '' },
    bankReference: { type: String, default: '' },
    qrCode: { type: String, default: '' },
    isUsed: { type: Boolean, default: false },
    usedAt: { type: Date },
  },
  { timestamps: true }
);

export const Ticket =
  mongoose.models.Ticket || mongoose.model<ITicket>('Ticket', TicketSchema);
