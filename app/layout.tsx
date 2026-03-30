import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Soirée 2.0 — E-Ticket portal',
  description: 'Official ticket portal for Batch Party 2026',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ position: 'relative', zIndex: 1 }} suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}
