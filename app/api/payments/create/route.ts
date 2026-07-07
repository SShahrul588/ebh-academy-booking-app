import { NextResponse } from "next/server";
import { paymentCreateSchema } from "@/lib/validators";
import { createPaymentCheckout } from "@/lib/payments";
import { getSupabaseAdmin } from "@/lib/supabase";

type CustomerInfo = {
  name?: string;
  email?: string;
  phone?: string;
};

type BookingRow = {
  id: string;
  booking_code?: string;
  room_slug?: string;
  start_at?: string;
  end_at?: string;
  total_amount?: number;
  deposit_amount?: number;
  customers?: CustomerInfo | CustomerInfo[];
};

function getCustomer(booking: BookingRow | null): CustomerInfo | null {
  if (!booking?.customers) return null;

  if (Array.isArray(booking.customers)) {
    return booking.customers[0] || null;
  }

  return booking.customers;
}

export async function POST(request: Request) {
  try {
    const payload = paymentCreateSchema.parse(await request.json());
    const provider = payload.provider || "mock";

    const supabase = getSupabaseAdmin();

    let booking: BookingRow | null = null;
    let customer: CustomerInfo | null = null;

    if (supabase) {
      const { data, error } = await supabase
        .from("bookings")
        .select(
          "id, booking_code, room_slug, start_at, end_at, total_amount, deposit_amount, customers(name,email,phone)"
        )
        .eq("id", payload.bookingId)
        .single();

      if (error) {
        throw error;
      }

      booking = data as unknown as BookingRow;
      customer = getCustomer(booking);
    }

    const bookingId = payload.bookingId;
    const bookingCode = booking?.booking_code || bookingId;
    const amount = payload.amount;

    if (provider === "mock") {
      const params = new URLSearchParams();

      params.set("booking", bookingId);

      if (booking?.room_slug) {
        params.set("roomSlug", booking.room_slug);
      }

      if (booking?.start_at) {
        params.set("startAt", booking.start_at);
      }

      if (booking?.end_at) {
        params.set("endAt", booking.end_at);
      }

      if (customer?.name) {
        params.set("customerName", customer.name);
      }

      if (customer?.email) {
        params.set("customerEmail", customer.email);
      }

      return NextResponse.json({
        provider: "mock",
        checkoutUrl: `/booking/success?${params.toString()}`,
        externalRef: bookingId,
        raw: {
          bookingId,
          bookingCode,
          mock: true,
        },
      });
    }

    const checkout = await createPaymentCheckout({
      provider,
      bookingId,
      bookingCode,
      amount,
      customerName: customer?.name,
      customerEmail: customer?.email,
      customerPhone: customer?.phone,
    });

    return NextResponse.json(checkout);
  } catch (error) {
    console.error("PAYMENT_CREATE_ERROR", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to create payment checkout",
      },
      { status: 400 }
    );
  }
}