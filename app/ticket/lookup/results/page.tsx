'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

interface Ticket {
  ticketId: string;
  name: string;
  batch: string;
  paymentStatus: 'pending' | 'verified' | 'rejected';
  createdAt: string;
}

function LookupResultsContent() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const router = useRouter();

  useEffect(() => {
    if (!email) {
      setError('No email provided');
      setLoading(false);
      return;
    }

    const fetchTickets = async () => {
      try {
        const res = await fetch(`/api/tickets/lookup?email=${encodeURIComponent(email)}`);
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || 'Failed to fetch tickets');
          return;
        }
        const data = await res.json();
        setTickets(data.tickets);
      } catch (err) {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [email]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return '#22c55e';
      case 'rejected': return '#ef4444';
      default: return '#fbbf24';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified': return 'Verified';
      case 'rejected': return 'Rejected';
      default: return 'Pending';
    }
  };

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="glass" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔍</div>
          <p>Searching for your tickets...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="glass" style={{ padding: '2rem', textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ marginBottom: '1rem' }}>Error</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>{error}</p>
          <Link href="/ticket/lookup">
            <button className="btn-outline" style={{ padding: '0.75rem 1.5rem', borderRadius: 50 }}>Try Again</button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', padding: '2rem', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Link href="/ticket/lookup" style={{ color: 'var(--gold)', textDecoration: 'none', fontSize: '0.9rem' }}>← Back to Search</Link>

        <h1 className="font-display" style={{ fontSize: '2rem', margin: '1.5rem 0 0.5rem' }}>
          <span className="gold-gradient">Your</span> Tickets
        </h1>
        <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>
          Found {tickets.length} ticket{tickets.length !== 1 ? 's' : ''} for <strong>{email}</strong>
        </p>

        <div style={{ display: 'grid', gap: '1rem' }}>
          {tickets.map((ticket) => (
            <div key={ticket.ticketId} className="glass" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{ticket.name}</h3>
                  <p style={{ color: 'var(--muted)', margin: 0, fontSize: '0.9rem' }}>{ticket.batch}</p>
                </div>
                <div style={{
                  background: getStatusColor(ticket.paymentStatus),
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: 20,
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}>
                  {getStatusText(ticket.paymentStatus)}
                </div>
              </div>

              <div style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8, padding: '1rem', marginBottom: '1rem' }}>
                <p style={{ fontFamily: 'monospace', fontSize: '1rem', color: 'var(--gold)', margin: 0, letterSpacing: '0.05em' }}>
                  {ticket.ticketId}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn-gold"
                  onClick={() => router.push(`/ticket/${ticket.ticketId}`)}
                  style={{ flex: 1, padding: '0.5rem', borderRadius: 25, fontSize: '0.9rem' }}
                >
                  View Ticket
                </button>
                <button
                  className="btn-outline"
                  onClick={() => navigator.clipboard.writeText(ticket.ticketId)}
                  style={{ padding: '0.5rem 1rem', borderRadius: 25, fontSize: '0.9rem' }}
                >
                  Copy ID
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link href="/">
            <button className="btn-outline" style={{ padding: '0.75rem 1.5rem', borderRadius: 50 }}>Home</button>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function LookupResultsPage() {
  return (
    <Suspense fallback={
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="glass" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔍</div>
          <p>Loading...</p>
        </div>
      </main>
    }>
      <LookupResultsContent />
    </Suspense>
  );
}