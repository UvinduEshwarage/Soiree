# 🎉 Batch Party E-Ticket System

A full-stack Next.js + MongoDB web app for managing batch party tickets with QR code entry.

## Features
- 🎟️ **Online Ticket Registration** – Standard & VIP tickets
- 🏦 **Manual Bank Payment** – Upload payment slip for verification
- 👨‍💼 **Admin Dashboard** – Verify/reject payments, view all tickets, stats
- 📱 **QR E-Ticket** – Generated after payment verification
- 🔍 **QR Scanner** – Camera-based or manual ticket verification at the door

## Tech Stack
- **Frontend/Backend**: Next.js 14 (App Router)
- **Database**: MongoDB + Mongoose
- **QR Generation**: qrcode
- **QR Scanning**: html5-qrcode

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Copy `.env.example` to `.env.local` and fill in your values:
```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string (local or Atlas) |
| `NEXT_PUBLIC_BASE_URL` | Your deployed URL (e.g. https://yourapp.com) |

### 3. Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## Pages

| Route | Description |
|---|---|
| `/` | Landing page with event info & payment details |
| `/register` | Ticket registration form |
| `/ticket/[ticketId]` | View your E-ticket & QR code |
| `/ticket/lookup` | Look up ticket by ID |
| `/admin` | Admin dashboard (manage payments) |
| `/scanner` | QR code scanner for entry |

## API Routes

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/tickets` | Register new ticket |
| `GET` | `/api/tickets` | List all tickets (admin) |
| `GET` | `/api/tickets/[id]` | Get single ticket |
| `PATCH` | `/api/tickets/[id]` | Update ticket (verify/reject) |
| `POST` | `/api/verify` | Verify & mark ticket as used |

## Workflow
1. Student registers → fills form + uploads bank slip
2. Admin reviews slip → verifies payment → QR activates
3. Student shows QR on phone → scanner marks as used → entry granted

## Deployment
Deploy to **Vercel** and use **MongoDB Atlas** for production.

```bash
npm run build
```
