'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LookupPage() {
  const [searchType, setSearchType] = useState<'ticketId' | 'email'>('ticketId');
  const [searchValue, setSearchValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Check for saved ticket ID on component mount
  useEffect(() => {
    try {
      const savedTicketId = localStorage.getItem('soiree_ticket_id');
      const savedEmail = localStorage.getItem('soiree_user_email');
      if (savedTicketId) {
        setSearchValue(savedTicketId);
        setSearchType('ticketId');
      } else if (savedEmail) {
        setSearchValue(savedEmail);
        setSearchType('email');
      }
    } catch (err) {
      console.warn('Failed to read from localStorage:', err);
    }
  }, []);

  const handleLookup = async () => {
    if (!searchValue.trim()) {
      setError(`Please enter your ${searchType === 'ticketId' ? 'Ticket ID' : 'email address'}`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (searchType === 'ticketId') {
        const res = await fetch(`/api/tickets/${searchValue.trim()}`);
        if (!res.ok) {
          setError('Ticket not found. Please check your ID.');
          return;
        }
        router.push(`/ticket/${searchValue.trim()}`);
      } else {
        // Search by email
        const res = await fetch(`/api/tickets/lookup?email=${encodeURIComponent(searchValue.trim())}`);
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || 'No tickets found for this email.');
          return;
        }
        const data = await res.json();
        if (data.tickets.length === 1) {
          router.push(`/ticket/${data.tickets[0].ticketId}`);
        } else {
          // Show list of tickets
          router.push(`/ticket/lookup/results?email=${encodeURIComponent(searchValue.trim())}`);
        }
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', zIndex: 1 }}>
      <div className="glass fade-up" style={{ padding: '2.5rem', width: '100%', maxWidth: '420px' }}>
        <Link href="/" style={{ color: 'var(--gold)', textDecoration: 'none', fontSize: '0.85rem' }}>← Back</Link>
        <h2 className="font-display" style={{ fontSize: '2rem', margin: '1rem 0 0.5rem' }}>
          <span className="gold-gradient">Find</span> Your Ticket
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Enter your Ticket ID or email address to find your ticket.
          {searchValue && <span style={{ color: 'var(--gold)' }}> (Pre-filled from your last registration)</span>}
        </p>

        {/* Search Type Toggle */}
        <div style={{ display: 'flex', marginBottom: '1.5rem', background: 'rgba(13,13,26,0.5)', borderRadius: 25, padding: '0.25rem' }}>
          <button
            onClick={() => { setSearchType('ticketId'); setSearchValue(''); setError(''); }}
            style={{
              flex: 1, padding: '0.5rem', borderRadius: 20, border: 'none', background: searchType === 'ticketId' ? 'var(--gold)' : 'transparent',
              color: searchType === 'ticketId' ? 'black' : 'var(--muted)', fontSize: '0.85rem', cursor: 'pointer'
            }}
          >
            Ticket ID
          </button>
          <button
            onClick={() => { setSearchType('email'); setSearchValue(''); setError(''); }}
            style={{
              flex: 1, padding: '0.5rem', borderRadius: 20, border: 'none', background: searchType === 'email' ? 'var(--gold)' : 'transparent',
              color: searchType === 'email' ? 'black' : 'var(--muted)', fontSize: '0.85rem', cursor: 'pointer'
            }}
          >
            Email
          </button>
        </div>

        <label style={{ display: 'block', marginBottom: '0.4rem' }}>
          {searchType === 'ticketId' ? 'Ticket ID' : 'Email Address'}
        </label>
        <input
          className="input-field"
          type={searchType === 'email' ? 'email' : 'text'}
          placeholder={searchType === 'ticketId' ? 'e.g. BATCH-A1B2C3D4' : 'you@example.com'}
          value={searchValue}
          onChange={e => { setSearchValue(e.target.value); setError(''); }}
          onKeyDown={e => e.key === 'Enter' && handleLookup()}
          style={{ marginBottom: '1rem', fontFamily: searchType === 'ticketId' ? 'monospace' : 'inherit', letterSpacing: searchType === 'ticketId' ? '0.05em' : 'inherit' }}
        />

        {error && <p style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem' }}>⚠️ {error}</p>}

        <button
          className="btn-gold"
          onClick={handleLookup}
          disabled={loading}
          style={{ width: '100%', padding: '0.875rem', borderRadius: 50, fontSize: '1rem' }}
        >
          {loading ? 'Searching...' : 'Find Ticket →'}
        </button>
      </div>
    </main>
  );
}
