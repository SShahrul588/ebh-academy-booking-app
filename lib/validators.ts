import { z } from "zod";

export const bookingRequestSchema = z.object({
  roomSlug: z.enum(["training-room", "meeting-room", "consultant-room", "bundle-all-rooms"]),
  packageCode: z.enum(["hourly", "half-day", "full-day", "full-day-meals", "weekly-3", "weekly-5", "monthly-weekday", "bundle-day", "bundle-weekly-3", "bundle-weekly-5", "bundle-monthly"]),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  pax: z.number().min(1).max(500).default(1),
  hours: z.number().min(1).max(24).optional(),
  selectedAddOns: z.array(z.string()).default([]),
  paymentMode: z.enum(["deposit_50", "full"]),
  customer: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(8),
    company: z.string().optional().default(""),
    notes: z.string().optional().default(""),
  }),
  price: z.object({
    basePrice: z.number(),
    addOnTotal: z.number(),
    subtotal: z.number(),
    depositAmount: z.number(),
    payableNow: z.number(),
    lines: z.array(z.object({ label: z.string(), qty: z.number(), unitPrice: z.number(), total: z.number() })),
  }),
});

export const calendarCheckSchema = z.object({
  roomSlug: z.enum(["training-room", "meeting-room", "consultant-room", "bundle-all-rooms"]),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
});

export const paymentCreateSchema = z.object({
  bookingId: z.string().min(1),
  amount: z.number().positive(),
  provider: z.enum(["mock", "billplz", "toyyibpay"]).default("mock"),
});
