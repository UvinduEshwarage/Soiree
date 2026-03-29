'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LookupPage() {
  const [ticketId, setTicketId] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLookup = async () => {
    if (!ticketId.trim()) { setError('Please enter your Ticket ID'); return; }
    const res = await fetch(`/api/tickets/${ticketId.trim()}`);
    if (!res.ok) { setError('Ticket not found. Please check your ID.'); return; }
    router.push(`/ticket/${ticketId.trim()}`);
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', zIndex: 1 }}>
      <div className="glass fade-up" style={{ padding: '2.5rem', width: '100%', maxWidth: '420px' }}>
        <Link href="/" style={{ color: 'var(--gold)', textDecoration: 'none', fontSize: '0.85rem' }}>← Back</Link>
        <h2 className="font-display" style={{ fontSize: '2rem', margin: '1rem 0 0.5rem' }}>
          <span className="gold-gradient">Find</span> Your Ticket
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Enter the Ticket ID you received after registration.
        </p>
        <label style={{ display: 'block', marginBottom: '0.4rem' }}>Ticket ID</label>
        <input className="input-field" placeholder="e.g. BATCH-A1B2C3D4"
          value={ticketId} onChange={e => { setTicketId(e.target.value); setError(''); }}
          onKeyDown={e => e.key === 'Enter' && handleLookup()}
          style={{ marginBottom: '1rem', fontFamily: 'monospace', letterSpacing: '0.05em' }} />
        {error && <p style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem' }}>⚠️ {error}</p>}
        <button className="btn-gold" onClick={handleLookup} style={{ width: '100%', padding: '0.875rem', borderRadius: 50, fontSize: '1rem' }}>
          Find Ticket →
        </button>
      </div>
    </main>
  );
}
