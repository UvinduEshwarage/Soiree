import nodemailer from 'nodemailer';

// Create transporter (you'll need to configure this with your email service)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendTicketConfirmationEmail(
  to: string,
  ticketId: string,
  name: string
) {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@soiree.com',
      to,
      subject: 'Your Soirée 2.0 E-Ticket Registration Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background: linear-gradient(135deg, #c9a84c, #d4af37); padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Soirée 2.0</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">E-Ticket Registration</p>
          </div>

          <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">Hello ${name}!</h2>

            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Thank you for registering for Soirée 2.0! Your ticket has been successfully submitted and is currently pending payment verification.
            </p>

            <div style="background: #f8f9fa; border: 2px solid #c9a84c; border-radius: 10px; padding: 20px; margin: 20px 0; text-align: center;">
              <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;">Your Ticket ID:</p>
              <p style="font-family: 'Courier New', monospace; font-size: 24px; font-weight: bold; color: #c9a84c; margin: 0; letter-spacing: 2px;">${ticketId}</p>
            </div>

            <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
              <strong>Important:</strong> Please save this Ticket ID as you'll need it to check your ticket status and access your QR code once payment is verified.
            </p>

            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              You can check your ticket status anytime at: <a href="${process.env.NEXT_PUBLIC_BASE_URL}/ticket/lookup" style="color: #c9a84c;">${process.env.NEXT_PUBLIC_BASE_URL}/ticket/lookup</a>
            </p>

            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                If you have any questions, please contact our support team.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Confirmation email sent to ${to} for ticket ${ticketId}`);
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    // Don't throw error - we don't want email failure to break registration
  }
}