import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Ticket } from '@/models/Ticket';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }

    await connectDB();

    // Find all tickets for this email
    const tickets = await Ticket.find({ email: email.toLowerCase() })
      .select('ticketId name batch paymentStatus createdAt')
      .sort({ createdAt: -1 })
      .lean();

    if (tickets.length === 0) {
      return NextResponse.json({ error: 'No tickets found for this email address' }, { status: 404 });
    }

    return NextResponse.json({ tickets });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}