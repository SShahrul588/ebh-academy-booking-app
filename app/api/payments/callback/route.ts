import { NextResponse } from "next/server";
import { createGoogleCalendarEvent } from "@/lib/google-calendar";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  const supabase = getSupabaseAdmin();

  // Map gateway payload here:
  // Billplz: verify X-Signature, bill id and paid status.
  // ToyyibPay: verify billcode/order_id and payment status.
  const bookingId = payload.booking_id || payload.order_id || payload.reference_1;
  const paid = payload.paid === true || payload.status === "paid" || payload.status_id === "1";

  if (!bookingId) return NextResponse.json({ ok: false, error: "Missing booking reference" }, { status: 400 });

  if (!supabase) return NextResponse.json({ ok: true, source: "mock", paid });

  const { data: booking, error } = await supabase
    .from("bookings")
    .select("*, customers(email,name)")
    .eq("id", bookingId)
    .single();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  if (paid) {
    await supabase.from("bookings").update({ payment_status: "paid", status: "confirmed" }).eq("id", bookingId);
    await supabase.from("payments").update({ status: "paid", raw_payload: payload }).eq("booking_id", bookingId);

    const customer = Array.isArray(booking.customers) ? booking.customers[0] : booking.customers;
    const event = await createGoogleCalendarEvent({
      roomSlug: booking.room_slug,
      summary: `EBH Booking ${booking.booking_code}`,
      description: `Customer: ${customer?.name || ""}\nBooking: ${booking.booking_code}`,
      startAt: booking.start_at,
      endAt: booking.end_at,
      customerEmail: customer?.email,
    });

    if (event.eventIds.length > 0) {
      await supabase.from("bookings").update({ google_event_id: event.eventIds.join(",") }).eq("id", bookingId);
    }
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ ok: true, message: "Payment callback endpoint is alive" });
}
