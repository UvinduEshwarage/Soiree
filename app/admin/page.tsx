/* eslint-disable react-hooks/set-state-in-effect */
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Ticket {
  _id: string; ticketId: string; name: string; email: string; phone: string;
  batch: string; indexNumber: string; ticketType: string; price: number;
  paymentStatus: string; bankReference: string; paymentSlip: string;
  isUsed: boolean; createdAt: string;
}

export default function AdminPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [updating, setUpdating] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/verify');
      const data = await res.json();
      setAuthenticated(data.authenticated);
    } catch {
      setAuthenticated(false);
    }
  };

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/tickets');
      const d = await r.json();
      if (r.ok) {
        setTickets(d.tickets || []);
      } else {
        console.error('Failed to load tickets:', d.error);
        setTickets([]);
      }
    } catch (error) {
      console.error('Error loading tickets:', error);
      setTickets([]);
    }
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    checkAuth();
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    if (authenticated) {
      load();
    }
  }, [authenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setAuthenticated(true);
        setEmail('');
        setPassword('');
      } else {
        setLoginError(data.error || 'Login failed');
      }
    } catch {
      setLoginError('Network error');
    }
    setLoginLoading(false);
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setAuthenticated(false);
    setTickets([]);
  };

  const updateStatus = async (ticketId: string, paymentStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus }),
      });
      if (res.ok) {
        setSelected(null);
        load();
      } else {
        console.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
    setUpdating(false);
  };

  const badgeClass: Record<string, string> = { pending: 'badge-pending', verified: 'badge-verified', rejected: 'badge-rejected' };

  const filtered = tickets.filter(t => {
    const matchFilter = filter === 'all' || t.paymentStatus === filter;
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.ticketId.toLowerCase().includes(search.toLowerCase()) ||
      t.indexNumber.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    all: tickets.length,
    pending: tickets.filter(t => t.paymentStatus === 'pending').length,
    verified: tickets.filter(t => t.paymentStatus === 'verified').length,
    rejected: tickets.filter(t => t.paymentStatus === 'rejected').length,
  };

  if (!authenticated) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', zIndex: 1 }}>
        <div className="glass" style={{ padding: '2rem', width: '100%', maxWidth: '400px' }}>
          <Link href="/" style={{ color: 'var(--gold)', textDecoration: 'none', fontSize: '0.85rem' }}>← Back</Link>
          <h2 className="font-display" style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--gold-light)' }}>Admin Login</h2>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="admin@example.com"
                required
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Enter password"
                required
              />
            </div>
            {loginError && <p style={{ color: '#f87171', fontSize: '0.875rem', marginBottom: '1rem' }}>{loginError}</p>}
            <button type="submit" className="btn-gold" style={{ width: '100%', padding: '0.75rem' }} disabled={loginLoading}>
              {loginLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', padding: '2rem', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <Link href="/" style={{ color: 'var(--gold)', textDecoration: 'none', fontSize: '0.85rem' }}>← Home</Link>
            <h1 className="font-display" style={{ fontSize: '2rem', marginTop: '0.5rem' }}>
              <span className="gold-gradient">Admin</span> Dashboard
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-outline" onClick={load} style={{ padding: '0.5rem 1.25rem', borderRadius: 50, fontSize: '0.85rem' }}>↻ Refresh</button>
            <Link href="/scanner"><button className="btn-gold" style={{ padding: '0.5rem 1.25rem', borderRadius: 50, fontSize: '0.85rem' }}>🔍 Scanner</button></Link>
            <button className="btn-outline" onClick={handleLogout} style={{ padding: '0.5rem 1.25rem', borderRadius: 50, fontSize: '0.85rem' }}>Logout</button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total', value: counts.all, color: 'var(--gold)' },
            { label: 'Pending', value: counts.pending, color: '#fbbf24' },
            { label: 'Verified', value: counts.verified, color: '#4ade80' },
            { label: 'Rejected', value: counts.rejected, color: '#f87171' },
            { label: 'Revenue (LKR)', value: tickets.filter(t => t.paymentStatus === 'verified').reduce((s, t) => s + t.price, 0).toLocaleString(), color: 'var(--gold-light)' },
            { label: 'Used', value: tickets.filter(t => t.isUsed).length, color: '#a78bfa' },
          ].map(({ label, value, color }) => (
            <div key={label} className="glass" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</p>
              <p style={{ color, fontSize: '1.75rem', fontWeight: 700, marginTop: '0.25rem' }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Filters + Search */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {(['all', 'pending', 'verified', 'rejected'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding: '0.4rem 1rem', borderRadius: 50, fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', textTransform: 'capitalize',
                  background: filter === f ? 'rgba(201,168,76,0.2)' : 'transparent',
                  border: filter === f ? '1px solid var(--gold)' : '1px solid rgba(201,168,76,0.2)',
                  color: filter === f ? 'var(--gold)' : 'var(--muted)',
                }}>
                {f} ({counts[f]})
              </button>
            ))}
          </div>
          <input className="input-field" placeholder="Search name, ticket ID, index..." value={search}
            onChange={e => setSearch(e.target.value)} style={{ maxWidth: 300 }} />
        </div>

        {/* Table */}
        <div className="glass" style={{ overflow: 'auto' }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted)' }}>Loading tickets...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted)' }}>No tickets found.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(201,168,76,0.2)' }}>
                  {['Ticket ID', 'Name', 'Batch', 'Type', 'Amount', 'Bank Ref', 'Status', 'Used', 'Action'].map(h => (
                    <th key={h} style={{ padding: '0.875rem 1rem', textAlign: 'left', color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(ticket => (
                  <tr key={ticket._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,168,76,0.04)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <code style={{ fontFamily: 'monospace', color: 'var(--gold)', fontSize: '0.8rem' }}>{ticket.ticketId}</code>
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <div style={{ fontWeight: 500 }}>{ticket.name}</div>
                      <div style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>{ticket.indexNumber}</div>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', color: 'var(--muted)' }}>{ticket.batch}</td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: 50,
                        background: 'rgba(124,58,237,0.15)',
                        color: '#a78bfa',
                        border: '1px solid rgba(124,58,237,0.3)',
                      }}>STANDARD</span>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', whiteSpace: 'nowrap' }}>LKR {ticket.price.toLocaleString()}</td>
                    <td style={{ padding: '0.875rem 1rem', color: 'var(--muted)', fontSize: '0.8rem' }}>{ticket.bankReference || '—'}</td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <span className={badgeClass[ticket.paymentStatus]} style={{ padding: '0.2rem 0.7rem', borderRadius: 50, fontSize: '0.75rem', fontWeight: 600 }}>
                        {ticket.paymentStatus}
                      </span>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', textAlign: 'center' }}>
                      {ticket.isUsed ? <span style={{ color: '#4ade80' }}>✓</span> : <span style={{ color: 'var(--muted)' }}>—</span>}
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <button onClick={() => setSelected(ticket)}
                        style={{ padding: '0.3rem 0.85rem', borderRadius: 50, fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'inherit',
                          background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', color: 'var(--gold)' }}>
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}
          onClick={() => setSelected(null)}>
          <div className="glass" style={{ width: '100%', maxWidth: 520, padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 className="font-display" style={{ fontSize: '1.5rem' }}>Review Ticket</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '1.5rem' }}>
              {[
                ['Ticket ID', selected.ticketId], ['Name', selected.name],
                ['Email', selected.email], ['Phone', selected.phone],
                ['Batch', selected.batch], ['Index No.', selected.indexNumber],
                ['Type', 'STANDARD'], ['Amount', `LKR ${selected.price.toLocaleString()}`],
                ['Bank Ref', selected.bankReference || '—'], ['Registered', new Date(selected.createdAt).toLocaleString()],
              ].map(([l, v]) => (
                <div key={l}>
                  <p style={{ color: 'var(--muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{l}</p>
                  <p style={{ fontSize: '0.9rem', marginTop: '0.1rem', wordBreak: 'break-all' }}>{v}</p>
                </div>
              ))}
            </div>

            {/* Payment slip */}
            {selected.paymentSlip && (
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Payment Slip</p>
                {selected.paymentSlip.startsWith('data:application/pdf') ? (
                  <div style={{ padding: '1rem', background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ fontSize: '1.5rem' }}>📄</div>
                      <div>
                        <p style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>PDF Document</p>
                        <a href={selected.paymentSlip} target="_blank" rel="noopener noreferrer"
                          style={{ color: 'var(--gold)', textDecoration: 'none', fontSize: '0.85rem' }}>
                          📎 View PDF →
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Image src={selected.paymentSlip} alt="Payment Slip" width={400} height={300} style={{ width: '100%', height: 'auto', borderRadius: 10, border: '1px solid rgba(201,168,76,0.2)' }} unoptimized />
                )}
              </div>
            )}

            {/* Current status */}
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Current Status</p>
              <span className={badgeClass[selected.paymentStatus]} style={{ padding: '0.3rem 1rem', borderRadius: 50, fontSize: '0.85rem', fontWeight: 600 }}>
                {selected.paymentStatus}
              </span>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
              <button className="btn-gold" onClick={() => updateStatus(selected.ticketId, 'verified')}
                disabled={updating || selected.paymentStatus === 'verified'}
                style={{ padding: '0.75rem', borderRadius: 10, fontSize: '0.875rem', opacity: selected.paymentStatus === 'verified' ? 0.5 : 1 }}>
                ✅ Verify
              </button>
              <button onClick={() => updateStatus(selected.ticketId, 'pending')}
                disabled={updating || selected.paymentStatus === 'pending'}
                style={{ padding: '0.75rem', borderRadius: 10, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit',
                  background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)', color: '#fbbf24',
                  opacity: selected.paymentStatus === 'pending' ? 0.5 : 1 }}>
                ⏳ Pending
              </button>
              <button onClick={() => updateStatus(selected.ticketId, 'rejected')}
                disabled={updating || selected.paymentStatus === 'rejected'}
                style={{ padding: '0.75rem', borderRadius: 10, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit',
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171',
                  opacity: selected.paymentStatus === 'rejected' ? 0.5 : 1 }}>
                ❌ Reject
              </button>
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
              <Link href={`/ticket/${selected.ticketId}`} target="_blank" style={{ flex: 1 }}>
                <button className="btn-outline" style={{ width: '100%', padding: '0.6rem', borderRadius: 10, fontSize: '0.85rem' }}>
                  View E-Ticket ↗
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
