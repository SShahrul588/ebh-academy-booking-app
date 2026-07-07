import { NextResponse } from "next/server";
import { createGoogleCalendarEvent } from "@/lib/google-calendar";
import { getSupabaseAdmin } from "@/lib/supabase";

type MockBookingPayload = {
  booking_id?: string;
  order_id?: string;
  reference_1?: string;
  paid?: boolean;
  status?: string;
  status_id?: string;
  roomSlug?: string;
  room_slug?: string;
  startAt?: string;
  start_at?: string;
  endAt?: string;
  end_at?: string;
  customerName?: string;
  customer_name?: string;
  customerEmail?: string;
  customer_email?: string;
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json().catch(() => ({}))) as MockBookingPayload;
    const supabase = getSupabaseAdmin();

    const bookingId =
      payload.booking_id || payload.order_id || payload.reference_1;

    const paid =
      payload.paid === true ||
      payload.status === "paid" ||
      payload.status_id === "1";

    if (!bookingId) {
      return NextResponse.json(
        { ok: false, error: "Missing booking reference" },
        { status: 400 }
      );
    }

    if (!paid) {
      return NextResponse.json({
        ok: true,
        paid: false,
        message: "Payment not marked as paid.",
      });
    }

    if (supabase) {
      const { data: booking, error } = await supabase
        .from("bookings")
        .select("*, customers(email,name)")
        .eq("id", bookingId)
        .single();

      if (error) {
        return NextResponse.json(
          { ok: false, error: error.message },
          { status: 500 }
        );
      }

      await supabase
        .from("bookings")
        .update({ payment_status: "paid", status: "confirmed" })
        .eq("id", bookingId);

      await supabase
        .from("payments")
        .update({ status: "paid", raw_payload: payload })
        .eq("booking_id", bookingId);

      const customer = Array.isArray(booking.customers)
        ? booking.customers[0]
        : booking.customers;

      const event = await createGoogleCalendarEvent({
        roomSlug: booking.room_slug,
        summary: `EBH Booking ${booking.booking_code}`,
        description: `Customer: ${customer?.name || ""}\nBooking: ${booking.booking_code}`,
        startAt: booking.start_at,
        endAt: booking.end_at,
        customerEmail: customer?.email,
      });

      if (event.eventIds.length > 0) {
        await supabase
          .from("bookings")
          .update({ google_event_id: event.eventIds.join(",") })
          .eq("id", bookingId);
      }

      return NextResponse.json({
        ok: true,
        source: "supabase",
        paid: true,
        calendar: event,
      });
    }

    const roomSlug = payload.roomSlug || payload.room_slug;
    const startAt = payload.startAt || payload.start_at;
    const endAt = payload.endAt || payload.end_at;
    const customerName = payload.customerName || payload.customer_name || "";
    const customerEmail = payload.customerEmail || payload.customer_email;

    if (!roomSlug || !startAt || !endAt) {
      return NextResponse.json({
        ok: true,
        source: "mock",
        paid: true,
        calendar: {
          created: false,
          reason:
            "Supabase is not configured and mock payload has no roomSlug/startAt/endAt.",
        },
      });
    }

    const event = await createGoogleCalendarEvent({
      roomSlug: roomSlug as never,
      summary: `EBH Booking ${bookingId}`,
      description: `Customer: ${customerName}\nBooking: ${bookingId}`,
      startAt,
      endAt,
      customerEmail,
    });

    return NextResponse.json({
      ok: true,
      source: "mock",
      paid: true,
      calendar: event,
    });
  } catch (error) {
    console.error("PAYMENT_CALLBACK_ERROR", error);

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Payment callback error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Payment callback endpoint is alive",
  });
}