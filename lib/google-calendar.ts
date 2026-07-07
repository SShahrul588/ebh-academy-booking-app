import { google } from "googleapis";
import type { RoomSlug } from "@/types";

const roomCalendarEnv: Record<Exclude<RoomSlug, "bundle-all-rooms">, string> = {
  "training-room": "GOOGLE_CALENDAR_TRAINING_ROOM_ID",
  "meeting-room": "GOOGLE_CALENDAR_MEETING_ROOM_ID",
  "consultant-room": "GOOGLE_CALENDAR_CONSULTANT_ROOM_ID",
};

function getAuthClient() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!clientEmail || !privateKey) return null;

  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });
}

export function getCalendarIds(roomSlug: RoomSlug): string[] {
  if (roomSlug === "bundle-all-rooms") {
    return Object.values(roomCalendarEnv).map((envName) => process.env[envName]).filter(Boolean) as string[];
  }
  const envName = roomCalendarEnv[roomSlug];
  const calendarId = process.env[envName];
  return calendarId ? [calendarId] : [];
}

export async function checkGoogleCalendarAvailability(input: { roomSlug: RoomSlug; startAt: string; endAt: string }) {
  const auth = getAuthClient();
  const calendarIds = getCalendarIds(input.roomSlug);

  if (!auth || calendarIds.length === 0) {
    return { available: true, source: "mock", busy: [] as unknown[] };
  }

  const calendar = google.calendar({ version: "v3", auth });
  const response = await calendar.freebusy.query({
    requestBody: {
      timeMin: input.startAt,
      timeMax: input.endAt,
      items: calendarIds.map((id) => ({ id })),
    },
  });

  const calendars = response.data.calendars || {};
  const busy = Object.values(calendars).flatMap((item) => item.busy || []);
  return { available: busy.length === 0, source: "google", busy };
}

export async function createGoogleCalendarEvent(input: {
  roomSlug: RoomSlug;
  summary: string;
  description?: string;
  startAt: string;
  endAt: string;
  customerEmail?: string;
}) {
  const auth = getAuthClient();
  const calendarIds = getCalendarIds(input.roomSlug);
  if (!auth || calendarIds.length === 0) return { created: false, source: "mock", eventIds: [] as string[] };

  const calendar = google.calendar({ version: "v3", auth });
  const eventIds: string[] = [];

  for (const calendarId of calendarIds) {
    const response = await calendar.events.insert({
      calendarId,
      requestBody: {
        summary: input.summary,
        description: input.description,
        start: { dateTime: input.startAt, timeZone: "Asia/Kuala_Lumpur" },
        end: { dateTime: input.endAt, timeZone: "Asia/Kuala_Lumpur" },
        attendees: input.customerEmail ? [{ email: input.customerEmail }] : undefined,
      },
    });
    if (response.data.id) eventIds.push(response.data.id);
  }

  return { created: true, source: "google", eventIds };
}
