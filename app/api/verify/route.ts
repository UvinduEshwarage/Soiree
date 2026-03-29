import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Ticket } from '@/models/Ticket';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { ticketId } = await req.json();
    if (!ticketId) return NextResponse.json({ error: 'ticketId required' }, { status: 400 });

    const ticket = await Ticket.findOne({ ticketId });
    if (!ticket) return NextResponse.json({ valid: false, reason: 'Ticket not found' }, { status: 404 });

    if (ticket.paymentStatus !== 'verified') {
      return NextResponse.json({ valid: false, reason: 'Payment not verified yet' }, { status: 200 });
    }
    if (ticket.isUsed) {
      return NextResponse.json({ valid: false, reason: 'Ticket already used', usedAt: ticket.usedAt }, { status: 200 });
    }

    ticket.isUsed = true;
    ticket.usedAt = new Date();
    await ticket.save();

    return NextResponse.json({ valid: true, ticket: { name: ticket.name, ticketType: ticket.ticketType, batch: ticket.batch } });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
