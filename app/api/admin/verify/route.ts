import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret') as { email: string };
    return NextResponse.json({ authenticated: true, email: decoded.email });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}