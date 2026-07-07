import { absoluteUrl } from "@/lib/utils";

export type PaymentProvider = "mock" | "billplz" | "toyyibpay";

export async function createPaymentCheckout(input: {
  provider: PaymentProvider;
  bookingId: string;
  bookingCode?: string;
  amount: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}) {
  const provider = input.provider || (process.env.PAYMENT_PROVIDER as PaymentProvider) || "mock";

  if (provider === "mock") {
    return {
      provider: "mock" as const,
      checkoutUrl: absoluteUrl(`/booking/success?booking=${input.bookingId}`),
      externalRef: `MOCK-${Date.now()}`,
      raw: { mode: "mock" },
    };
  }

  if (provider === "billplz") {
    if (!process.env.BILLPLZ_API_KEY || !process.env.BILLPLZ_COLLECTION_ID) {
      throw new Error("Missing BILLPLZ_API_KEY or BILLPLZ_COLLECTION_ID");
    }
    // Production adapter location. Add Billplz bill creation API here.
    // Keep the route shape stable: return checkoutUrl + externalRef.
    return {
      provider: "billplz" as const,
      checkoutUrl: absoluteUrl(`/booking?payment_provider=billplz&booking=${input.bookingId}`),
      externalRef: `BILLPLZ-PENDING-${input.bookingId}`,
      raw: { todo: "Implement Billplz bill creation with API key and collection ID" },
    };
  }

  if (provider === "toyyibpay") {
    if (!process.env.TOYYIBPAY_SECRET_KEY || !process.env.TOYYIBPAY_CATEGORY_CODE) {
      throw new Error("Missing TOYYIBPAY_SECRET_KEY or TOYYIBPAY_CATEGORY_CODE");
    }
    // Production adapter location. Add ToyyibPay createBill API here.
    return {
      provider: "toyyibpay" as const,
      checkoutUrl: absoluteUrl(`/booking?payment_provider=toyyibpay&booking=${input.bookingId}`),
      externalRef: `TOYYIBPAY-PENDING-${input.bookingId}`,
      raw: { todo: "Implement ToyyibPay createBill with sandbox/live URL switch" },
    };
  }

  throw new Error("Unsupported payment provider");
}
