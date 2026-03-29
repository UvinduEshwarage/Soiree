import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || [];
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (!ADMIN_EMAILS.includes(email)) {
      return NextResponse.json({ error: 'Unauthorized email' }, { status: 401 });
    }

    const isValidPassword = password === ADMIN_PASSWORD;
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET || 'defaultsecret', { expiresIn: '24h' });

    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 24 hours
    });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}