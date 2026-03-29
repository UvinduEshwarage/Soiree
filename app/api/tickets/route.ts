import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Ticket } from '@/models/Ticket';
import { generateQRCode } from '@/lib/qr';
import { v4 as uuidv4 } from 'uuid';
import { verifyAdmin } from '@/lib/auth';

const PRICES = { standard: 1500, vip: 2500 };

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, phone, batch, indexNumber, ticketType, bankReference, paymentSlip } = body;

    if (!name || !email || !phone || !batch || !indexNumber) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const existing = await Ticket.findOne({ indexNumber, batch });
    if (existing) {
      return NextResponse.json({ error: 'A ticket already exists for this index number' }, { status: 409 });
    }

    const ticketId = `BATCH-${uuidv4().slice(0, 8).toUpperCase()}`;
    const type = ticketType === 'vip' ? 'vip' : 'standard';
    const price = PRICES[type];

    const qrCode = await generateQRCode(ticketId);

    const ticket = await Ticket.create({
      ticketId,
      name,
      email,
      phone,
      batch,
      indexNumber,
      ticketType: type,
      price,
      bankReference: bankReference || '',
      paymentSlip: paymentSlip || '',
      qrCode,
    });

    return NextResponse.json({ success: true, ticketId: ticket.ticketId }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    if (!verifyAdmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();
    const tickets = await Ticket.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ tickets });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
