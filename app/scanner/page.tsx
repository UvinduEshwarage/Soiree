'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface ScanResult {
  valid: boolean;
  reason?: string;
  ticket?: { name: string; ticketType: string; batch: string };
  usedAt?: string;
}

export default function ScannerPage() {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [scanning, setScanning] = useState(false);
  const [manualId, setManualId] = useState('');
  const [checking, setChecking] = useState(false);
  const scannerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const html5QrRef = useRef<any>(null);

  const verifyTicket = async (ticketId: string) => {
    setChecking(true);
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ valid: false, reason: 'Network error' });
    }
    setChecking(false);
  };

  const startScanner = async () => {
    if (typeof window === 'undefined') return;
    const { Html5Qrcode } = await import('html5-qrcode');
    html5QrRef.current = new Html5Qrcode('qr-reader');
    setScanning(true);
    setResult(null);
    html5QrRef.current.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      async (decodedText: string) => {
        await html5QrRef.current.stop();
        setScanning(false);
        // Extract ticket ID from URL or raw value
        const match = decodedText.match(/BATCH-[A-Z0-9]+/);
        const ticketId = match ? match[0] : decodedText;
        await verifyTicket(ticketId);
      },
      undefined
    ).catch(() => setScanning(false));
  };

  const stopScanner = async () => {
    if (html5QrRef.current) {
      await html5QrRef.current.stop().catch(() => {});
      setScanning(false);
    }
  };

  useEffect(() => () => { stopScanner(); }, []);

  const reset = () => { setResult(null); setManualId(''); };

  return (
    <main style={{ minHeight: '100vh', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        <Link href="/" style={{ color: 'var(--gold)', textDecoration: 'none', fontSize: '0.85rem' }}>← Home</Link>
        <h1 className="font-display" style={{ fontSize: '2rem', margin: '1rem 0 0.25rem' }}>
          <span className="gold-gradient">Ticket</span> Scanner
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>Scan QR code or enter ticket ID to verify entry.</p>

        {/* Scanner area */}
        <div className="glass" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div id="qr-reader" ref={scannerRef} style={{ width: '100%', borderRadius: 12, overflow: 'hidden', minHeight: scanning ? 300 : 0 }} />
          
          {!scanning && !result && (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📷</div>
              <button className="btn-gold" onClick={startScanner}
                style={{ padding: '0.875rem 2rem', borderRadius: 50, fontSize: '1rem', width: '100%' }}>
                Start Camera Scanner
              </button>
            </div>
          )}

          {scanning && (
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <p style={{ color: 'var(--gold)', marginBottom: '0.75rem', fontSize: '0.9rem' }}>📡 Scanning... Point camera at QR code</p>
              <button className="btn-outline" onClick={stopScanner}
                style={{ padding: '0.5rem 1.5rem', borderRadius: 50, fontSize: '0.875rem' }}>
                Stop Scanner
              </button>
            </div>
          )}
        </div>

        {/* Manual entry */}
        {!result && (
          <div className="glass" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <p style={{ color: 'var(--muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Or Enter Manually</p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <input className="input-field" placeholder="BATCH-XXXXXXXX" value={manualId}
                onChange={e => setManualId(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && manualId && verifyTicket(manualId)}
                style={{ fontFamily: 'monospace', flex: 1 }} />
              <button className="btn-gold" onClick={() => verifyTicket(manualId)} disabled={!manualId || checking}
                style={{ padding: '0.75rem 1.25rem', borderRadius: 10, whiteSpace: 'nowrap', fontSize: '0.875rem' }}>
                {checking ? '...' : 'Verify'}
              </button>
            </div>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="glass fade-up" style={{ padding: '2rem', textAlign: 'center', marginBottom: '1.5rem',
            border: result.valid ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(239,68,68,0.4)',
            background: result.valid ? 'rgba(34,197,94,0.05)' : 'rgba(239,68,68,0.05)',
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
              {result.valid ? '✅' : '❌'}
            </div>
            <h2 className="font-display" style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: result.valid ? '#4ade80' : '#f87171' }}>
              {result.valid ? 'Entry Granted!' : 'Access Denied'}
            </h2>

            {result.valid && result.ticket && (
              <div style={{ marginTop: '1rem', background: 'rgba(34,197,94,0.08)', borderRadius: 12, padding: '1.25rem' }}>
                <p style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>{result.ticket.name}</p>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{result.ticket.batch}</p>
                <span style={{ display: 'inline-block', marginTop: '0.5rem', padding: '0.25rem 0.875rem', borderRadius: 50, fontSize: '0.8rem', fontWeight: 600,
                  background: result.ticket.ticketType === 'vip' ? 'rgba(201,168,76,0.2)' : 'rgba(124,58,237,0.2)',
                  color: result.ticket.ticketType === 'vip' ? 'var(--gold)' : '#a78bfa',
                  border: result.ticket.ticketType === 'vip' ? '1px solid var(--gold)' : '1px solid rgba(124,58,237,0.4)',
                }}>
                  {result.ticket.ticketType === 'vip' ? '👑 VIP' : '🎟️ Standard'}
                </span>
              </div>
            )}

            {!result.valid && result.reason && (
              <p style={{ color: '#f87171', fontSize: '1rem', marginTop: '0.5rem' }}>{result.reason}</p>
            )}
            {!result.valid && result.usedAt && (
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                Used at: {new Date(result.usedAt).toLocaleString()}
              </p>
            )}

            <button className="btn-gold" onClick={reset} style={{ marginTop: '1.5rem', padding: '0.75rem 2rem', borderRadius: 50, fontSize: '0.9rem' }}>
              Scan Next Ticket
            </button>
          </div>
        )}

        <Link href="/admin">
          <button className="btn-outline" style={{ width: '100%', padding: '0.75rem', borderRadius: 50, fontSize: '0.875rem' }}>
            Go to Admin Dashboard
          </button>
        </Link>
      </div>
    </main>
  );
}
