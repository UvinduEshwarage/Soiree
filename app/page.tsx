import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', zIndex: 1 }}>
      {/* Hero */}
      <div className="fade-up" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <p style={{ color: 'var(--gold)', letterSpacing: '0.3em', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '1rem' }}>✦ Official E-Ticket Portal ✦</p>
        <h1 className="font-display" style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', lineHeight: 1.1, marginBottom: '1rem' }}>
          <span className="shimmer">Soirée 2.0</span>
          <br />
          <span style={{ color: 'var(--text)' }}>Dharmapala Vidyalaya Kottawa</span><br/>
          <span style={{ color: 'var(--text)' }}>2026</span>
        </h1>
        <p style={{ color: 'var(--muted)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
          Secure your spot at the most anticipated event of the year. Get your E-ticket, pay via bank transfer, and scan at the door.
        </p>
      </div>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', width: '100%', maxWidth: '900px', marginBottom: '3rem' }}>
        {/* Ticket Info */}
        <div className="glass fade-up" style={{ padding: '2rem', animationDelay: '0.1s' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🎟️</div>
          <h3 className="font-display" style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--gold-light)' }}>Standard Ticket</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>LKR 5000</p>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Enjoy full access to the party with music, vibes, and general entry.  One entry per ticket.</p>
        </div>
        
        <div className="glass fade-up" style={{ padding: '2rem', animationDelay: '0.3s' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🏦</div>
          <h3 className="font-display" style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--gold-light)' }}>Bank Payment</h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
            Bank: <strong style={{ color: 'var(--text)' }}>Commercial Bank</strong><br />
            A/C: <strong style={{ color: 'var(--text)' }}>1234567890</strong><br />
            Name: <strong style={{ color: 'var(--text)' }}>Batch Party Fund</strong>
          </p>
        </div>
      </div>

      {/* How it works */}
      <div className="glass fade-up" style={{ padding: '2rem', width: '100%', maxWidth: '700px', marginBottom: '3rem', animationDelay: '0.4s' }}>
        <h2 className="font-display" style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--gold-light)' }}>How It Works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
          {[
            { step: '01', icon: '📝', text: 'Register & fill your details' },
            { step: '02', icon: '🏦', text: 'Pay via bank transfer' },
            { step: '03', icon: '📸', text: 'Upload payment slip' },
            { step: '04', icon: '✅', text: 'Admin verifies payment' },
            { step: '05', icon: '📱', text: 'Get your QR E-Ticket' },
            { step: '06', icon: '🎉', text: 'Scan & enter the party!' },
          ].map((s) => (
            <div key={s.step}>
              <div style={{ color: 'var(--gold)', fontSize: '0.7rem', letterSpacing: '0.2em', marginBottom: '0.25rem' }}>{s.step}</div>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{s.icon}</div>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{s.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/register">
          <button className="btn-gold" style={{ padding: '0.875rem 2.5rem', borderRadius: '50px', fontSize: '1rem' }}>
            Get My Ticket →
          </button>
        </Link>
        <Link href="/admin">
          <button className="btn-outline" style={{ padding: '0.875rem 2rem', borderRadius: '50px', fontSize: '1rem' }}>
            Admin Panel
          </button>
        </Link>
       
      </div>

      <p style={{ marginTop: '3rem', color: 'var(--muted)', fontSize: '0.8rem' }}>
        Already registered? <Link href="/ticket/lookup" style={{ color: 'var(--gold)' }}>Look up your ticket →</Link>
      </p>
      <p style={{ marginTop: '3rem', color: 'var(--muted)', fontSize: '0.8rem' }}>© 2026 Uvindu Nethmina. All rights reserved.</p>
    </main>
  );
}
