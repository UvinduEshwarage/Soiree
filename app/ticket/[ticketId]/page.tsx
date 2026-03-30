'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Ticket {
  ticketId: string; name: string; email: string; phone: string;
  batch: string; indexNumber: string; ticketType: string;
  price: number; paymentStatus: string; qrCode: string;
  isUsed: boolean; usedAt?: string; createdAt: string;
}

export default function TicketPage() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/tickets/${ticketId}`).then(r => r.json()).then(d => { setTicket(d.ticket); setLoading(false); });
  }, [ticketId]);

  if (loading) return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, position: 'relative' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '2px solid var(--gold)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
        <p style={{ color: 'var(--muted)', marginTop: '1rem' }}>Loading ticket...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  );

  if (!ticket) return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, position: 'relative' }}>
      <div className="glass" style={{ padding: '3rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem' }}>❌</div>
        <h2 className="font-display" style={{ marginTop: '1rem' }}>Ticket Not Found</h2>
        <Link href="/"><button className="btn-gold" style={{ marginTop: '1.5rem', padding: '0.75rem 2rem', borderRadius: 50 }}>Home</button></Link>
      </div>
    </main>
  );

  const statusColors: Record<string, string> = { pending: '#fbbf24', verified: '#4ade80', rejected: '#f87171' };
  const statusLabel: Record<string, string> = { pending: '⏳ Pending Verification', verified: '✅ Payment Verified', rejected: '❌ Payment Rejected' };

  const downloadPDF = async () => {
    if (!ticket) return;
    const printElement = document.getElementById('ticket-print-section');
    if (!printElement) return;

    // Raise resolution for better quality
    const canvas = await html2canvas(printElement, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait' });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 40;
    const aspectRatio = canvas.width / canvas.height;
    const imgHeight = imgWidth / aspectRatio;

    const y = 20;
    pdf.addImage(imgData, 'PNG', 20, y, imgWidth, imgHeight);

    // If content overflows one page, add more pages
    if (imgHeight + 40 > pageHeight) {
      const totalPages = Math.ceil((imgHeight + 40) / pageHeight);
      for (let i = 1; i < totalPages; i += 1) {
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 20, -pageHeight * i + 20, imgWidth, imgHeight);
      }
    }

    pdf.save(`${ticket.ticketId}-eticket.pdf`);
  };

  return (
    <main style={{ minHeight: '100vh', padding: '2rem', position: 'relative', zIndex: 1 }}>
      <style>{`
        @media print {
          body { background: #ffffff !important; color: #000 !important; }
          .no-print { display: none !important; }
          #ticket-print-section { width: 100% !important; box-shadow: none !important; }
          #ticket-print-section * { color: #000 !important; }
        }
      `}</style>

      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <Link href="/" style={{ color: 'var(--gold)', textDecoration: 'none', fontSize: '0.9rem' }}>← Home</Link>
          {ticket.paymentStatus === 'verified' && !ticket.isUsed ? (
            <button onClick={downloadPDF} className="btn-gold" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', borderRadius: 45 }}>
              ⬇️ Download Ticket PDF
            </button>
          ) : (
            <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
              Ticket download available only after admin approval.  
            </span>
          )}
        </div>

        {/* Ticket Card */}
        <div id="ticket-print-section" style={{ marginTop: '1.5rem', position: 'relative' }}>
          {/* Top section */}
          <div className="glass" style={{ borderRadius: '16px 16px 0 0', borderBottom: 'none', padding: '2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--gold)', letterSpacing: '0.3em', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>✦ E-Ticket ✦</p>
            <h1 className="font-display shimmer" style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Soirée 2.0</h1>
            <span style={{ display: 'inline-block', padding: '0.25rem 1rem', borderRadius: 50, fontSize: '0.75rem', fontWeight: 600,
              background: 'rgba(124,58,237,0.2)',
              color: '#a78bfa',
              border: '1px solid rgba(124,58,237,0.4)',
            }}>🎟️ Standard</span>

            {/* QR Code */}
            <div style={{ margin: '1.5rem 0' }}>
              {ticket.paymentStatus === 'verified' && !ticket.isUsed ? (
                <div>
                  <Image src={ticket.qrCode} alt="QR Code" width={200} height={200} style={{ borderRadius: 12, margin: '0 auto', display: 'block', border: '4px solid rgba(201,168,76,0.3)' }} unoptimized />
                  <p style={{ color: '#4ade80', fontSize: '0.8rem', marginTop: '0.5rem' }}>Scan to enter</p>
                </div>
              ) : ticket.isUsed ? (
                <div style={{ padding: '2rem', background: 'rgba(239,68,68,0.1)', borderRadius: 12, border: '1px solid rgba(239,68,68,0.3)' }}>
                  <div style={{ fontSize: '3rem' }}>🚫</div>
                  <p style={{ color: '#f87171', fontWeight: 600 }}>Ticket Used</p>
                  <p style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{ticket.usedAt ? new Date(ticket.usedAt).toLocaleString() : ''}</p>
                </div>
              ) : (
                <div style={{ padding: '2rem', background: 'rgba(234,179,8,0.08)', borderRadius: 12, border: '1px solid rgba(234,179,8,0.2)' }}>
                  <div style={{ fontSize: '3rem' }}>⏳</div>
                  <p style={{ color: '#fbbf24', fontSize: '0.9rem' }}>QR unlocks after payment verification</p>
                </div>
              )}
            </div>
          </div>

          {/* Dashed separator */}
          <div style={{ position: 'relative', height: 0, background: 'rgba(201,168,76,0.2)', overflow: 'visible' }}>
            <div style={{ border: 'none', borderTop: '2px dashed rgba(201,168,76,0.3)', margin: '0 1.5rem' }} />
            <div style={{ position: 'absolute', left: -16, top: -16, width: 32, height: 32, borderRadius: '50%', background: 'var(--deep)', border: '1px solid rgba(201,168,76,0.2)' }} />
            <div style={{ position: 'absolute', right: -16, top: -16, width: 32, height: 32, borderRadius: '50%', background: 'var(--deep)', border: '1px solid rgba(201,168,76,0.2)' }} />
          </div>

          {/* Details section */}
          <div className="glass" style={{ borderRadius: '0 0 16px 16px', borderTop: 'none', padding: '1.5rem 2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              {[
                { l: 'Name', v: ticket.name },
                { l: 'Index No.', v: ticket.indexNumber },
                { l: 'Batch', v: ticket.batch },
                { l: 'Ticket ID', v: ticket.ticketId },
                { l: 'Amount', v: `LKR ${ticket.price.toLocaleString()}` },
                { l: 'Registered', v: new Date(ticket.createdAt).toLocaleDateString() },
              ].map(({ l, v }) => (
                <div key={l}>
                  <p style={{ color: 'var(--muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{l}</p>
                  <p style={{ fontWeight: 500, fontSize: '0.9rem', marginTop: '0.1rem' }}>{v}</p>
                </div>
              ))}
            </div>

            {/* Payment status */}
            <div style={{ marginTop: '0.5rem', padding: '0.75rem', borderRadius: 10, textAlign: 'center',
              background: `${statusColors[ticket.paymentStatus]}15`,
              border: `1px solid ${statusColors[ticket.paymentStatus]}40`,
              color: statusColors[ticket.paymentStatus], fontSize: '0.875rem', fontWeight: 600 }}>
              {statusLabel[ticket.paymentStatus]}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
