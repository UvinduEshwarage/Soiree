import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function verifyAdmin(req: NextRequest): string | null {
  const token = req.cookies.get('admin_token')?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret') as { email: string };
    return decoded.email;
  } catch {
    return null;
  }
}