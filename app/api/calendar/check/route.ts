import { NextResponse } from "next/server";
import { calendarCheckSchema } from "@/lib/validators";
import { checkGoogleCalendarAvailability } from "@/lib/google-calendar";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const payload = calendarCheckSchema.parse(await request.json());

    if (new Date(payload.endAt) <= new Date(payload.startAt)) {
      return NextResponse.json({ available: false, reason: "End time must be after start time" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data: room } = await supabase.from("rooms").select("id, slug").eq("slug", payload.roomSlug).maybeSingle();
      const roomFilter = payload.roomSlug === "bundle-all-rooms" ? undefined : room?.id;

      let query = supabase
        .from("bookings")
        .select("id")
        .lt("start_at", payload.endAt)
        .gt("end_at", payload.startAt)
        .in("status", ["pending", "confirmed"])
        .limit(1);

      if (roomFilter) query = query.or(`room_id.eq.${roomFilter},room_slug.eq.bundle-all-rooms`);

      const { data: conflicts, error } = await query;
      if (error) throw error;
      if (conflicts && conflicts.length > 0) {
        return NextResponse.json({ available: false, reason: "Slot already booked in Supabase" });
      }

      let blockedQuery = supabase
        .from("blocked_slots")
        .select("id")
        .lt("start_at", payload.endAt)
        .gt("end_at", payload.startAt)
        .limit(1);
      if (roomFilter) blockedQuery = blockedQuery.or(`room_id.eq.${roomFilter},room_id.is.null`);
      const { data: blocked, error: blockedError } = await blockedQuery;
      if (blockedError) throw blockedError;
      if (blocked && blocked.length > 0) {
        return NextResponse.json({ available: false, reason: "Slot blocked for maintenance/private booking" });
      }
    }

    const calendar = await checkGoogleCalendarAvailability(payload);
    if (!calendar.available) return NextResponse.json({ available: false, reason: "Slot already busy in Google Calendar", busy: calendar.busy });

    return NextResponse.json({ available: true, source: calendar.source });
  } catch (error) {
    return NextResponse.json({ available: false, error: error instanceof Error ? error.message : "Invalid request" }, { status: 400 });
  }
}
