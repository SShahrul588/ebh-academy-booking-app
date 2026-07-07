import { Suspense } from "react";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { BookingWizard } from "@/components/booking/BookingWizard";

export const metadata = {
  title: "Book Room",
  description: "Book Training Room, Meeting Room, Consultant Room or Bundle Package at EBH Training Academy.",
};

export default async function BookingPage({
  searchParams,
}: {
  searchParams?: Promise<{ mock_payment?: string; booking?: string }>;
}) {
  const params = await searchParams;
  const isPaymentSuccess = params?.mock_payment === "success";
  return (
    <main className="min-h-screen bg-gradient-to-b from-navy-50 to-white">
      <SiteHeader />
      <section className="premium-container pb-20 pt-28">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-gold-dark">Online Booking</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-navy-700 sm:text-5xl">Book your workspace in minutes</h1>
          <p className="mt-4 text-navy-700/70">Pilih bilik, tarikh, package, add-on makanan dan buat bayaran deposit/full payment.</p>
        </div>
        <Suspense fallback={<div className="rounded-3xl bg-white p-8 shadow-premium">Loading booking wizard...</div>}>
          <BookingWizard />
        </Suspense>
      </section>
      <SiteFooter />
    </main>
  );
}
