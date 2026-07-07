import { SiteHeader } from "@/components/landing/SiteHeader";
import { SiteFooter } from "@/components/landing/SiteFooter";
import Link from "next/link";

export const metadata = {
  title: "Payment Successful",
  description: "Booking payment successful",
};

export default function BookingSuccessPage() {
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

          <div className="mt-8 rounded-2xl bg-navy-50 p-5 text-left text-navy-800">
            <p className="font-bold">Next Step:</p>
            <p className="mt-1">
              Sila tunggu confirmation daripada team EBH Training Academy
              melalui WhatsApp / panggilan.
            </p>
          </div>

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