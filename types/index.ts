export type RoomSlug = "training-room" | "meeting-room" | "consultant-room" | "bundle-all-rooms";

export type PackageCode =
  | "hourly"
  | "half-day"
  | "full-day"
  | "full-day-meals"
  | "weekly-3"
  | "weekly-5"
  | "monthly-weekday"
  | "bundle-day"
  | "bundle-weekly-3"
  | "bundle-weekly-5"
  | "bundle-monthly";

export type PaymentMode = "deposit_50" | "full";
export type BookingStatus = "pending" | "confirmed" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded" | "cancelled";

export interface Room {
  slug: RoomSlug;
  name: string;
  capacity: string;
  description: string;
  image: string;
  highlights: string[];
}

export interface PackageOption {
  code: PackageCode;
  roomSlug: RoomSlug;
  label: string;
  description: string;
  durationHours?: number;
  price: number;
  type: "short_term" | "long_term" | "bundle";
  requiresHourlyInput?: boolean;
  includesMeals?: boolean;
}

export interface AddOn {
  code: string;
  label: string;
  price: number;
  unit: "pax" | "booking";
}
