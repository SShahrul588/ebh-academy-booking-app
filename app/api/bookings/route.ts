import { NextResponse } from "next/server";
import { bookingRequestSchema } from "@/lib/validators";
import { calculateBookingPrice } from "@/lib/pricing";
import { checkGoogleCalendarAvailability } from "@/lib/google-calendar";
import { getSupabaseAdmin } from "@/lib/supabase";

function makeBookingCode() {
  const date = new Date();
  const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  return `EBH-${stamp}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

export async function GET() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ bookings: [], source: "mock" });

  const { data, error } = await supabase
    .from("bookings")
    .select("*, rooms(name, slug), customers(name, phone, email)")
    .order("start_at", { ascending: true })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ bookings: data, source: "supabase" });
}

export async function POST(request: Request) {
  try {
    const payload = bookingRequestSchema.parse(await request.json());
    const calculated = calculateBookingPrice({
      roomSlug: payload.roomSlug,
      packageCode: payload.packageCode,
      hours: payload.hours,
      pax: payload.pax,
      selectedAddOns: payload.selectedAddOns,
      paymentMode: payload.paymentMode,
    });

    if (Math.abs(calculated.subtotal - payload.price.subtotal) > 0.01) {
      return NextResponse.json({ error: "Price mismatch. Please refresh and try again." }, { status: 409 });
    }

    const availability = await checkGoogleCalendarAvailability({
      roomSlug: payload.roomSlug,
      startAt: payload.startAt,
      endAt: payload.endAt,
    });
    if (!availability.available) return NextResponse.json({ error: "Selected slot is no longer available" }, { status: 409 });

    const bookingCode = makeBookingCode();
    const supabase = getSupabaseAdmin();

    if (!supabase) {
      return NextResponse.json({
        source: "mock",
        booking: {
          id: `mock_${Date.now()}`,
          booking_code: bookingCode,
          status: "pending",
          payment_status: "pending",
          ...payload,
          price: calculated,
        },
      });
    }

    const { data: room, error: roomError } = await supabase.from("rooms").select("id, slug, name").eq("slug", payload.roomSlug).maybeSingle();
    if (roomError) throw roomError;

    let conflictQuery = supabase
      .from("bookings")
      .select("id")
      .lt("start_at", payload.endAt)
      .gt("end_at", payload.startAt)
      .in("status", ["pending", "confirmed"])
      .limit(1);

    if (payload.roomSlug !== "bundle-all-rooms" && room?.id) {
      conflictQuery = conflictQuery.or(`room_id.eq.${room.id},room_slug.eq.bundle-all-rooms`);
    }

    const { data: conflicts, error: conflictError } = await conflictQuery;
    if (conflictError) throw conflictError;
    if (conflicts && conflicts.length > 0) {
      return NextResponse.json({ error: "Selected slot already has a pending/confirmed booking" }, { status: 409 });
    }

    let blockedQuery = supabase
      .from("blocked_slots")
      .select("id")
      .lt("start_at", payload.endAt)
      .gt("end_at", payload.startAt)
      .limit(1);

    if (payload.roomSlug !== "bundle-all-rooms" && room?.id) {
      blockedQuery = blockedQuery.or(`room_id.eq.${room.id},room_id.is.null`);
    }

    const { data: blocked, error: blockedError } = await blockedQuery;
    if (blockedError) throw blockedError;
    if (blocked && blocked.length > 0) {
      return NextResponse.json({ error: "Selected slot has been blocked" }, { status: 409 });
    }

    const { data: pkg, error: pkgError } = await supabase
      .from("packages")
      .select("id, code, name")
      .eq("room_slug", payload.roomSlug)
      .eq("code", payload.packageCode)
      .maybeSingle();
    if (pkgError) throw pkgError;

    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .upsert(
        {
          name: payload.customer.name,
          email: payload.customer.email,
          phone: payload.customer.phone,
          company: payload.customer.company,
        },
        { onConflict: "email" }
      )
      .select("id, name, email, phone")
      .single();
    if (customerError) throw customerError;

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        booking_code: bookingCode,
        customer_id: customer.id,
        room_id: room?.id,
        package_id: pkg?.id,
        room_slug: payload.roomSlug,
        package_code: payload.packageCode,
        start_at: payload.startAt,
        end_at: payload.endAt,
        pax: payload.pax,
        subtotal: calculated.subtotal,
        add_on_total: calculated.addOnTotal,
        total_amount: calculated.subtotal,
        deposit_amount: calculated.depositAmount,
        payment_mode: payload.paymentMode,
        status: "pending",
        payment_status: "pending",
        notes: payload.customer.notes,
      })
      .select("*")
      .single();

    if (bookingError) throw bookingError;

    const items = calculated.lines.map((line) => ({
      booking_id: booking.id,
      label: line.label,
      quantity: line.qty,
      unit_price: line.unitPrice,
      total: line.total,
    }));
    if (items.length > 0) await supabase.from("booking_items").insert(items);

    return NextResponse.json({ booking, source: "supabase" });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Booking failed" }, { status: 400 });
  }
}
