# EBH Training Academy Booking App

Premium booking web app for EBH Training Academy: workspace rental, training room, meeting room and consultant room booking.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn-style UI components
- Framer Motion
- Lucide React icons
- Supabase PostgreSQL
- Google Calendar API integration structure
- Billplz / ToyyibPay payment adapter structure
- Netlify deployment ready

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open: http://localhost:3000

## Supabase Setup

1. Create a Supabase project.
2. Open SQL Editor.
3. Run `supabase/schema.sql`.
4. Copy project URL and service role key into `.env.local`.

Important environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Google Calendar Setup

Recommended setup: one calendar per room.

- Training Room calendar
- Meeting Room calendar
- Consultant Room calendar

Create a Google Cloud service account, enable Calendar API and share every room calendar with the service account email.

Add these variables:

```env
GOOGLE_CLIENT_EMAIL=
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_TRAINING_ROOM_ID=
GOOGLE_CALENDAR_MEETING_ROOM_ID=
GOOGLE_CALENDAR_CONSULTANT_ROOM_ID=
```

Booking flow checks Google Calendar via `/api/calendar/check`. After a successful payment callback, the system creates Google Calendar events.

## Payment Gateway

Default mode is mock:

```env
PAYMENT_PROVIDER=mock
```

For Malaysia payment gateway integration, use either:

```env
PAYMENT_PROVIDER=billplz
BILLPLZ_API_KEY=
BILLPLZ_COLLECTION_ID=
BILLPLZ_X_SIGNATURE_KEY=
```

or:

```env
PAYMENT_PROVIDER=toyyibpay
TOYYIBPAY_SECRET_KEY=
TOYYIBPAY_CATEGORY_CODE=
TOYYIBPAY_USE_SANDBOX=true
```

Adapter placeholders are in `lib/payments.ts`. The API shape is ready and stable.

## Netlify Deploy

1. Push this repo to GitHub.
2. Import project in Netlify.
3. Set build command: `npm run build`.
4. Set publish directory: `.next`.
5. Add environment variables from `.env.example`.
6. Point `www.ebhacademy.com` DNS to Netlify.

## Core Routes

- `/` Landing page
- `/booking` Booking wizard
- `/admin` Admin dashboard placeholder
- `/api/bookings` Booking API
- `/api/calendar/check` Availability API
- `/api/payments/create` Payment creation API
- `/api/payments/callback` Payment callback API

## Production Notes

Before going live:

- Replace mock payment adapter with real Billplz or ToyyibPay API call.
- Add Supabase Auth for `/admin`.
- Add email provider such as Resend/Postmark for confirmations.
- Add WhatsApp Cloud API or WhatsApp pre-filled message redirect.
- Add exact Google Maps embed URL.
- Add booking expiration cleanup for unpaid pending bookings.
