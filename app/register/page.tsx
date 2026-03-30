'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', batch: '', indexNumber: '',
    ticketType: 'standard', bankReference: '', paymentSlip: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [ticketId, setTicketId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const prices = { standard: 5000 };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMsg('Please upload a JPG image or PDF file only');
      setStatus('error');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('File size must be less than 5MB');
      setStatus('error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => setForm(f => ({ ...f, paymentSlip: ev.target?.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    // Phone validation
    if (!form.phone || !/^0\d{9}$/.test(form.phone)) {
      setErrorMsg('Phone number must be exactly 10 digits and start with 0 (e.g., 0712345678)');
      setStatus('error');
      return;
    }

    // Check if all required fields are filled
    if (!form.name || !form.email || !form.phone || !form.batch || !form.indexNumber || !form.paymentSlip) {
      setErrorMsg('All fields are required, including payment slip upload');
      setStatus('error');
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setErrorMsg(data.error); setStatus('error'); return; }
      setTicketId(data.ticketId);
      setStatus('success');
    } catch {
      setErrorMsg('Network error. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'success') return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', zIndex: 1 }}>
      <div className="glass fade-up" style={{ padding: '3rem', textAlign: 'center', maxWidth: '480px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
        <h2 className="font-display shimmer" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Registration Successful!</h2>
        <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>Your ticket ID is:</p>
        <div style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid var(--gold)', borderRadius: 12, padding: '1rem', marginBottom: '1.5rem' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '1.3rem', color: 'var(--gold)', letterSpacing: '0.1em' }}>{ticketId}</p>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.7 }}>
          Your ticket is <strong style={{ color: '#fbbf24' }}>pending payment verification</strong>. 
          Once the admin verifies your bank transfer, your QR ticket will be activated. Save your Ticket ID!
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href={`/ticket/${ticketId}`}>
            <button className="btn-gold" style={{ padding: '0.75rem 1.5rem', borderRadius: 50 }}>View Ticket</button>
          </Link>
          <Link href="/">
            <button className="btn-outline" style={{ padding: '0.75rem 1.5rem', borderRadius: 50 }}>Home</button>
          </Link>
        </div>
      </div>
    </main>
  );

  return (
    <main style={{ minHeight: '100vh', padding: '2rem', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <Link href="/" style={{ color: 'var(--gold)', textDecoration: 'none', fontSize: '0.9rem' }}>← Back</Link>
        <h1 className="font-display" style={{ fontSize: '2.5rem', margin: '1.5rem 0 0.5rem', lineHeight: 1.1 }}>
          <span className="gold-gradient">Soirée 2.0 </span> E-Ticket Registration!
        </h1>
        <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Fill in your details and upload your payment slip to get your E-ticket.</p>

        <div className="glass" style={{ padding: '2rem' }}>
          {/* Ticket Info */}
          <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎟️</div>
            <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Standard Ticket</div>
            <div style={{ color: 'var(--gold)', fontSize: '1.2rem', fontWeight: 700 }}>LKR {prices.standard.toLocaleString()}</div>
          </div>

          {/* Fields */}
          <div style={{ display: 'grid', gap: '1rem' }}>
            {[
              { key: 'name', label: 'Full Name', placeholder: 'Your full name', type: 'text' },
              { key: 'email', label: 'Email Address', placeholder: 'you@example.com', type: 'email' },
              { key: 'phone', label: 'Phone Number', placeholder: '0712345678 (10 digits, starts with 0)', type: 'tel' },
              { key: 'batch', label: 'Out year ', placeholder: 'e.g. 2019/2022', type: 'text' },
              { key: 'indexNumber', label: 'NIC', placeholder: '200315100***', type: 'text' },
              { key: 'bankReference', label: 'Bank Reference / Transaction ID', placeholder: 'e.g. TXN123456789', type: 'text' },
            ].map(({ key, label, placeholder, type }) => (
              <div key={key}>
                <label style={{ display: 'block', marginBottom: '0.4rem' }}>{label}</label>
                <input className="input-field" type={type} placeholder={placeholder}
                  value={(form as Record<string, string>)[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
              </div>
            ))}

            {/* Payment Slip Upload */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem' }}>Payment Slip (JPG or PDF)</label>
              <div style={{
                border: '1px dashed rgba(201,168,76,0.4)', borderRadius: 12, padding: '1.5rem',
                textAlign: 'center', cursor: 'pointer', position: 'relative',
                background: form.paymentSlip ? 'rgba(34,197,94,0.05)' : 'rgba(13,13,26,0.5)',
              }}>
                <input type="file" accept=".jpg,.jpeg,.pdf" onChange={handleFile}
                  style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%' }} />
                {form.paymentSlip ? (
                  <div>
                    <div style={{ color: '#4ade80', fontSize: '1.5rem' }}>✓</div>
                    <p style={{ color: '#4ade80', fontSize: '0.9rem' }}>Payment slip uploaded</p>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>📎</div>
                    <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Click to upload payment slip (JPG or PDF)</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bank Info reminder */}
            <div style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 12, padding: '1rem' }}>
              <p style={{ color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>💳 Payment Details</p>
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.8 }}>
                Bank: Commercial Bank · A/C No: 1234567890<br />
                Account Name: Batch Party Fund<br />
                Amount: LKR {prices.standard.toLocaleString()}
              </p>
            </div>

            {status === 'error' && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '0.875rem', color: '#f87171', fontSize: '0.9rem' }}>
                ⚠️ {errorMsg}
              </div>
            )}

            <button className="btn-gold" onClick={handleSubmit} disabled={status === 'loading'}
              style={{ padding: '1rem', borderRadius: 50, fontSize: '1rem', width: '100%', marginTop: '0.5rem' }}>
              {status === 'loading' ? 'Submitting...' : 'Submit Registration →'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
