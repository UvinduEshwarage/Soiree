import QRCode from 'qrcode';

export async function generateQRCode(ticketId: string): Promise<string> {
  const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/ticket/${ticketId}`;
  const qr = await QRCode.toDataURL(verifyUrl, {
    errorCorrectionLevel: 'H',
    width: 400,
    margin: 2,
    color: { dark: '#1a1a2e', light: '#ffffff' },
  });
  return qr;
}
