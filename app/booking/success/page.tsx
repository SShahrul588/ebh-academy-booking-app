import { SiteHeader } from "@/components/landing/SiteHeader";
import { SiteFooter } from "@/components/landing/SiteFooter";
import Link from "next/link";

export const metadata = {
  title: "Payment Successful",
  description: "Booking payment successful",
};

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://ebh-academy-booking-app.netlify.app";

async function confirmPaymentAndCreateCalendarEvent(searchParams: {
  booking?: string;
  roomSlug?: string;
  startAt?: string;
  endAt?: string;
  customerName?: string;
  customerEmail?: string;
}) {
  if (!searchParams.booking) {
    return {
      ok: false,
      message: "Booking ID not found.",
    };
  }

  try {
    const response = await fetch(`${siteUrl}/api/payments/callback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({
        booking_id: searchParams.booking,
        paid: true,
        status: "paid",
        reference: searchParams.booking,
        roomSlug: searchParams.roomSlug,
        startAt: searchParams.startAt,
        endAt: searchParams.endAt,
        customerName: searchParams.customerName,
        customerEmail: searchParams.customerEmail,
        source: "mock_payment_success_page",
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || data?.ok === false) {
      return {
        ok: false,
        message:
          data?.error ||
          data?.message ||
          data?.calendar?.reason ||
          "Payment confirmed, but calendar event could not be created.",
      };
    }

    if (data?.calendar?.created === false) {
      return {
        ok: false,
        message:
          data?.calendar?.reason ||
          "Payment confirmed, but calendar event could not be created.",
      };
    }

    return {
      ok: true,
      message: "Booking confirmed and calendar event created.",
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Payment confirmed, but calendar event could not be created.",
    };
  }
}

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams?: Promise<{
    booking?: string;
    roomSlug?: string;
    startAt?: string;
    endAt?: string;
    customerName?: string;
    customerEmail?: string;
  }>;
}) {
  const params = (await searchParams) || {};
  const confirmation = await confirmPaymentAndCreateCalendarEvent(params);

  return (
    <main className="min-h-screen bg-gradient-to-b from-navy-50 to-white">
      <SiteHeader />

      <section className="premium-container py-24">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-green-200 bg-white p-10 text-center shadow-xl">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
            ✅
          </div>

          <p className="text-sm font-bold uppercase tracking-[0.3em] text-green-700">
            Payment Successful
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight text-navy-900">
            Thank you for your booking
          </h1>

          <p className="mt-4 text-lg text-navy-700/80">
            Your booking has been received successfully. Our team will contact
            you shortly for confirmation.
          </p>

          {params.booking && (
            <div className="mt-6 rounded-2xl bg-navy-50 p-5 text-left text-navy-800">
              <p className="font-bold">Booking Reference:</p>
              <p className="mt-1 break-all">{params.booking}</p>
            </div>
          )}

          <div className="mt-6 rounded-2xl bg-navy-50 p-5 text-left text-navy-800">
            <p className="font-bold">Next Step:</p>
            <p className="mt-1">
              Sila tunggu confirmation daripada team EBH Training Academy
              melalui WhatsApp / panggilan.
            </p>
          </div>

          {confirmation.ok ? (
            <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5 text-left text-green-900">
              <p className="font-bold">Calendar Status:</p>
              <p className="mt-1">
                Booking confirmation has been processed successfully and added
                to Google Calendar.
              </p>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-5 text-left text-yellow-900">
              <p className="font-bold">Calendar Status:</p>
              <p className="mt-1">{confirmation.message}</p>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="rounded-full bg-gold-500 px-8 py-4 font-black text-navy-950 shadow-lg"
            >
              Back to Home
            </Link>

            <Link
              href="/booking"
              className="rounded-full border border-navy-200 bg-white px-8 py-4 font-black text-navy-900"
            >
              Make Another Booking
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}