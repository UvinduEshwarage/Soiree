import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Ticket } from '@/models/Ticket';
import { generateQRCode } from '@/lib/qr';
import { v4 as uuidv4 } from 'uuid';
import { verifyAdmin } from '@/lib/auth';

const PRICES = { standard: 5000 };

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const contentType = req.headers.get('content-type') || '';
    let name = '';
    let email = '';
    let phone = '';
    let batch = '';
    let indexNumber = '';
    let ticketType = 'standard';
    let bankReference = '';
    let paymentSlip = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      name = (formData.get('name') as string) || '';
      email = (formData.get('email') as string) || '';
      phone = (formData.get('phone') as string) || '';
      batch = (formData.get('batch') as string) || '';
      indexNumber = (formData.get('indexNumber') as string) || '';
      ticketType = (formData.get('ticketType') as string) || 'standard';
      bankReference = (formData.get('bankReference') as string) || '';

      const slipFile = formData.get('paymentSlip');
      if (slipFile && slipFile instanceof File) {
        const buffer = await slipFile.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        paymentSlip = `data:${slipFile.type};base64,${base64}`;
      }
    } else {
      const body = await req.json();
      name = body.name || '';
      email = body.email || '';
      phone = body.phone || '';
      batch = body.batch || '';
      indexNumber = body.indexNumber || '';
      ticketType = body.ticketType || 'standard';
      bankReference = body.bankReference || '';
      paymentSlip = body.paymentSlip || '';
    }

    if (!name || !email || !phone || !batch || !indexNumber) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const existing = await Ticket.findOne({ indexNumber, batch });
    if (existing) {
      return NextResponse.json({ error: 'A ticket already exists for this index number' }, { status: 409 });
    }

    const ticketId = `BATCH-${uuidv4().slice(0, 8).toUpperCase()}`;
    const type = 'standard';
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
