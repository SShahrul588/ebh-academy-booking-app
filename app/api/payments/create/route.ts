import { NextResponse } from "next/server";
import { paymentCreateSchema } from "@/lib/validators";
import { createPaymentCheckout } from "@/lib/payments";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const payload = paymentCreateSchema.parse(await request.json());
    const provider = (process.env.PAYMENT_PROVIDER || payload.provider || "mock") as "mock" | "billplz" | "toyyibpay";
    const supabase = getSupabaseAdmin();

    let booking: { id: string; booking_code?: string; customer_id?: string } | null = { id: payload.bookingId };
    let customer: { name?: string; email?: string; phone?: string } | null = null;

    if (supabase && !payload.bookingId.startsWith("mock_")) {
      const { data, error } = await supabase.from("bookings").select("id, booking_code, customer_id, customers(name,email,phone)").eq("id", payload.bookingId).single();
      if (error) throw error;
      booking = data as typeof booking;
      customer = Array.isArray((data as any).customers) ? (data as any).customers[0] : (data as any).customers;
    }

    const checkout = await createPaymentCheckout({
      provider,
      bookingId: payload.bookingId,
      bookingCode: booking?.booking_code,
      amount: payload.amount,
      customerName: customer?.name,
      customerEmail: customer?.email,
      customerPhone: customer?.phone,
    });

    if (supabase && !payload.bookingId.startsWith("mock_")) {
      await supabase.from("payments").insert({
        booking_id: payload.bookingId,
        provider: checkout.provider,
        amount: payload.amount,
        status: "pending",
        external_ref: checkout.externalRef,
        checkout_url: checkout.checkoutUrl,
        raw_payload: checkout.raw,
      });
    }

    return NextResponse.json({ checkoutUrl: checkout.checkoutUrl, provider: checkout.provider, externalRef: checkout.externalRef });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Payment creation failed" }, { status: 400 });
  }
}
