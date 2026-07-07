import { addOns, packages } from "@/lib/data";
import type { PackageCode, PaymentMode, RoomSlug } from "@/types";

export interface PriceInput {
  roomSlug: RoomSlug;
  packageCode: PackageCode;
  hours?: number;
  pax?: number;
  selectedAddOns?: string[];
  paymentMode?: PaymentMode;
}

export interface PriceBreakdown {
  basePrice: number;
  addOnTotal: number;
  subtotal: number;
  depositAmount: number;
  payableNow: number;
  lines: Array<{ label: string; qty: number; unitPrice: number; total: number }>;
}

export function calculateBookingPrice(input: PriceInput): PriceBreakdown {
  const pkg = packages.find((item) => item.roomSlug === input.roomSlug && item.code === input.packageCode);
  if (!pkg) throw new Error("Invalid room/package selection");

  const hours = Math.max(1, input.hours || pkg.durationHours || 1);
  const pax = Math.max(1, input.pax || 1);
  const basePrice = pkg.requiresHourlyInput ? pkg.price * hours : pkg.price;
  const lines: PriceBreakdown["lines"] = [
    { label: pkg.label, qty: pkg.requiresHourlyInput ? hours : 1, unitPrice: pkg.price, total: basePrice },
  ];

  const addOnTotal = (input.selectedAddOns || []).reduce((sum, code) => {
    const addOn = addOns.find((item) => item.code === code);
    if (!addOn) return sum;
    const qty = addOn.unit === "pax" ? pax : 1;
    const total = addOn.price * qty;
    lines.push({ label: addOn.label, qty, unitPrice: addOn.price, total });
    return sum + total;
  }, 0);

  const subtotal = basePrice + addOnTotal;
  const depositAmount = Math.round(subtotal * 0.5 * 100) / 100;
  const payableNow = input.paymentMode === "deposit_50" ? depositAmount : subtotal;

  return { basePrice, addOnTotal, subtotal, depositAmount, payableNow, lines };
}

export function getDefaultPackage(roomSlug: RoomSlug): PackageCode {
  return packages.find((item) => item.roomSlug === roomSlug)?.code || "hourly";
}
