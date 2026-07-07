# EBH Training Academy — Product Architecture

## 1. Full Project Architecture

### Frontend

- `app/page.tsx`: premium landing page with hero, room showcase, pricing, gallery, FAQ and final CTA.
- `app/booking/page.tsx`: step-by-step booking wizard.
- `app/admin/page.tsx`: admin dashboard starter.
- `components/landing/*`: marketing sections.
- `components/booking/BookingWizard.tsx`: booking flow, real-time price calculation and API submission.
- `components/ui/*`: shadcn-style reusable UI primitives.

### Backend API Routes

- `POST /api/calendar/check`
  - Validates date/time.
  - Checks Supabase bookings and blocked slots.
  - Checks Google Calendar free/busy when keys exist.

- `GET /api/bookings`
  - Lists bookings for admin view.

- `POST /api/bookings`
  - Validates request payload.
  - Recalculates price on server.
  - Checks Google Calendar and Supabase conflicts.
  - Creates/upserts customer.
  - Creates booking and booking line items.

- `POST /api/payments/create`
  - Creates payment record.
  - Returns checkout URL.
  - Supports `mock`, `billplz`, `toyyibpay` adapter structure.

- `POST /api/payments/callback`
  - Receives payment callback.
  - Updates payment status.
  - Confirms booking.
  - Creates Google Calendar event.

### Data Layer

- Supabase PostgreSQL is the source of truth.
- Google Calendar is the operational availability calendar.
- Payment gateway callback confirms payment and triggers calendar event creation.

### Booking Lifecycle

1. Customer selects room.
2. Customer selects date, package and time slot.
3. System checks Supabase + Google Calendar availability.
4. Customer selects add-ons and payment option.
5. Customer enters details.
6. Server recalculates price.
7. Booking is created as `pending`.
8. Payment checkout is created.
9. Payment callback updates payment to `paid`.
10. Booking becomes `confirmed`.
11. Google Calendar event is created.

## 2. Folder Structure

```txt
ebh-academy-booking-app/
  app/
    page.tsx
    layout.tsx
    globals.css
    booking/page.tsx
    admin/page.tsx
    api/
      bookings/route.ts
      calendar/check/route.ts
      payments/create/route.ts
      payments/callback/route.ts
  components/
    booking/BookingWizard.tsx
    landing/
      SiteHeader.tsx
      Hero.tsx
      Facilities.tsx
      RoomShowcase.tsx
      PricingSection.tsx
      Gallery.tsx
      FAQ.tsx
      LocationCTA.tsx
      SiteFooter.tsx
    ui/
      button.tsx
      card.tsx
      badge.tsx
      input.tsx
      label.tsx
      select.tsx
      textarea.tsx
  lib/
    data.ts
    pricing.ts
    validators.ts
    supabase.ts
    google-calendar.ts
    payments.ts
    utils.ts
  public/images/
    hero-training.jpg
    training-room.jpg
    meeting-room.jpg
    consultant-room.jpg
    pantry.jpg
    surau.jpg
  supabase/schema.sql
  docs/ARCHITECTURE.md
  .env.example
  netlify.toml
```

## 3. Database Schema

Use `supabase/schema.sql`. The schema includes:

- `rooms`
- `packages`
- `add_ons`
- `customers`
- `bookings`
- `booking_items`
- `payments`
- `blocked_slots`
- `admin_users`

Double-booking protection:

- API-level conflict check before creating booking.
- PostgreSQL exclusion constraint for overlapping booking ranges on the same room.
- Google Calendar free/busy check.

## 4. Google Calendar Integration Plan

Recommended calendar structure:

- Calendar 1: EBH Training Room
- Calendar 2: EBH Meeting Room
- Calendar 3: EBH Consultant Room

Implementation:

1. Create a Google Cloud project.
2. Enable Google Calendar API.
3. Create a service account.
4. Share each room calendar with service account email.
5. Add calendar IDs to `.env.local`.
6. Availability check uses `freebusy.query`.
7. Confirmed booking uses `events.insert`.

Bundle package:

- Checks all room calendars.
- Creates events in all room calendars.

## 5. Payment Gateway Integration Plan

### Current Structure

- `lib/payments.ts` exposes a stable `createPaymentCheckout()` interface.
- `/api/payments/create` calls the adapter.
- `/api/payments/callback` updates Supabase booking status and creates Google Calendar event.

### Billplz

Required env:

```env
PAYMENT_PROVIDER=billplz
BILLPLZ_API_KEY=
BILLPLZ_COLLECTION_ID=
BILLPLZ_X_SIGNATURE_KEY=
```

Flow:

1. Create bill in Billplz.
2. Store bill ID as `payments.external_ref`.
3. Redirect customer to Billplz checkout URL.
4. Verify callback signature.
5. Update payment and booking.

### ToyyibPay

Required env:

```env
PAYMENT_PROVIDER=toyyibpay
TOYYIBPAY_SECRET_KEY=
TOYYIBPAY_CATEGORY_CODE=
TOYYIBPAY_USE_SANDBOX=true
```

Flow:

1. Create bill in ToyyibPay.
2. Store bill code as `payments.external_ref`.
3. Redirect customer to ToyyibPay payment URL.
4. Verify callback payload.
5. Update payment and booking.

## 6. UI Component List

### Landing

- Premium sticky header
- Hero with large photography
- Selling-point cards
- Room showcase cards
- Pricing cards
- Long-term pricing table
- Bundle package promo card
- Gallery grid
- FAQ accordion
- Final CTA
- Mobile sticky Book Now button

### Booking

- Step progress indicator
- Room selection cards
- Date selector
- Package selector
- Time slot selector
- Add-on selector
- Customer details form
- Real-time price breakdown
- Pay 50% deposit / full payment option
- Availability check badge

### Admin

- Bookings view placeholder
- Status filters placeholder
- Revenue placeholder
- Manual booking placeholder

## 7. Step-by-Step Build Plan

### Phase 1 — Working MVP

1. Install dependencies.
2. Run Supabase SQL.
3. Add environment variables.
4. Run local Next.js app.
5. Test booking in mock payment mode.
6. Deploy to Netlify.

### Phase 2 — Real Operations

1. Add Google Calendar service account.
2. Add real room calendar IDs.
3. Add payment provider adapter.
4. Add payment callback verification.
5. Add email confirmation.
6. Add WhatsApp pre-filled confirmation.

### Phase 3 — Admin Dashboard

1. Add Supabase Auth.
2. Protect `/admin` route.
3. Build bookings table.
4. Add approve/cancel actions.
5. Add blocked slots form.
6. Add pricing editor.
7. Add CSV export.
8. Add revenue analytics.

### Phase 4 — Growth

1. Add SEO programmatic pages.
2. Add Google Maps embed.
3. Add testimonials.
4. Add promo code module.
5. Add recurring long-term booking engine.
6. Add invoice/receipt PDF generation.
