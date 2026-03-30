import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Batch Party 2025 — E-Ticket System',
  description: 'Official ticket portal for Batch Party 2025',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ position: 'relative', zIndex: 1 }} suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}
