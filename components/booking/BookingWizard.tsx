"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CalendarDays, CheckCircle2, Clock, CreditCard, Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { addOns, packages, rooms } from "@/lib/data";
import { calculateBookingPrice, getDefaultPackage } from "@/lib/pricing";
import { formatMYR } from "@/lib/utils";
import type { PackageCode, PaymentMode, RoomSlug } from "@/types";

const roomSlugs = rooms.map((room) => room.slug);
const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

export function BookingWizard() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [roomSlug, setRoomSlug] = useState<RoomSlug>("training-room");
  const [packageCode, setPackageCode] = useState<PackageCode>("hourly");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const [hours, setHours] = useState(1);
  const [pax, setPax] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("deposit_50");
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "", company: "", notes: "" });
  const [availability, setAvailability] = useState<"idle" | "checking" | "available" | "unavailable">("idle");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const queryRoom = searchParams.get("room") as RoomSlug | null;
    if (queryRoom && roomSlugs.includes(queryRoom)) {
      setRoomSlug(queryRoom);
      setPackageCode(getDefaultPackage(queryRoom));
    }
  }, [searchParams]);

  const room = rooms.find((item) => item.slug === roomSlug) || rooms[0];
  const roomPackages = useMemo(() => packages.filter((item) => item.roomSlug === roomSlug), [roomSlug]);
  const selectedPackage = roomPackages.find((item) => item.code === packageCode) || roomPackages[0];

  useEffect(() => {
    if (!roomPackages.some((item) => item.code === packageCode)) {
      setPackageCode(roomPackages[0]?.code || "hourly");
    }
    setAvailability("idle");
  }, [roomSlug]);

  const price = useMemo(
    () =>
      calculateBookingPrice({
        roomSlug,
        packageCode: selectedPackage.code,
        hours,
        pax,
        selectedAddOns,
        paymentMode,
      }),
    [roomSlug, selectedPackage.code, hours, pax, selectedAddOns, paymentMode]
  );

  const endDateTime = useMemo(() => {
    if (!date || !time) return null;
    const start = new Date(`${date}T${time}:00`);
    const duration = selectedPackage.requiresHourlyInput ? hours : selectedPackage.durationHours || 8;
    const end = new Date(start.getTime() + duration * 60 * 60 * 1000);
    return { start, end };
  }, [date, time, hours, selectedPackage]);

  function toggleAddOn(code: string) {
    setSelectedAddOns((current) => (current.includes(code) ? current.filter((item) => item !== code) : [...current, code]));
  }

  async function checkAvailability() {
    if (!date || !time || !endDateTime) {
      setMessage("Pilih tarikh dan masa terlebih dahulu.");
      return;
    }
    setAvailability("checking");
    setMessage(null);
    const response = await fetch("/api/calendar/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomSlug, startAt: endDateTime.start.toISOString(), endAt: endDateTime.end.toISOString() }),
    });
    const result = (await response.json()) as { available: boolean; reason?: string };
    setAvailability(result.available ? "available" : "unavailable");
    if (!result.available) setMessage(result.reason || "Slot ini tidak tersedia. Sila pilih masa lain.");
  }

  async function submitBooking() {
    if (!date || !time || !endDateTime) return setMessage("Lengkapkan tarikh dan masa booking.");
    if (!customer.name || !customer.email || !customer.phone) return setMessage("Nama, email dan nombor telefon diperlukan.");
    setSubmitting(true);
    setMessage(null);

    try {
      const bookingRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomSlug,
          packageCode: selectedPackage.code,
          startAt: endDateTime.start.toISOString(),
          endAt: endDateTime.end.toISOString(),
          pax,
          hours: selectedPackage.requiresHourlyInput ? hours : selectedPackage.durationHours,
          selectedAddOns,
          paymentMode,
          customer,
          price,
        }),
      });
      const bookingData = await bookingRes.json();
      if (!bookingRes.ok) throw new Error(bookingData.error || "Booking failed");

      const paymentRes = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: bookingData.booking.id, amount: price.payableNow, provider: "mock" }),
      });
      const paymentData = await paymentRes.json();
      if (!paymentRes.ok) throw new Error(paymentData.error || "Payment failed");

      if (paymentData.checkoutUrl) window.location.href = paymentData.checkoutUrl;
      else setMessage(`Booking created. Reference: ${bookingData.booking.booking_code}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unexpected error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[.78fr_.42fr]">
      <Card className="overflow-hidden">
        <CardHeader className="navy-gradient text-white">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-gold-light">Booking Wizard</p>
              <CardTitle className="mt-2 text-white">Tempah ruang EBH Training Academy</CardTitle>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur">Step {step}/4</div>
          </div>
          <div className="mt-5 grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((number) => <div key={number} className={`h-2 rounded-full ${number <= step ? "bg-gold" : "bg-white/20"}`} />)}
          </div>
        </CardHeader>

        <CardContent className="p-5 sm:p-8">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-black text-navy-700">1. Select room type</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {rooms.map((item) => (
                  <button
                    key={item.slug}
                    onClick={() => { setRoomSlug(item.slug); setPackageCode(getDefaultPackage(item.slug)); }}
                    className={`overflow-hidden rounded-3xl border text-left transition hover:-translate-y-1 ${roomSlug === item.slug ? "border-gold bg-gold/10 shadow-gold" : "border-navy-700/10 bg-white shadow-sm"}`}
                  >
                    <div className="relative h-44">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="p-5">
                      <p className="text-xl font-black text-navy-700">{item.name}</p>
                      <p className="mt-1 text-sm font-bold text-gold-dark">{item.capacity}</p>
                      <p className="mt-2 text-sm leading-6 text-navy-700/65">{item.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h2 className="text-2xl font-black text-navy-700">2. Date, package & time slot</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Date</Label>
                  <Input type="date" value={date} onChange={(e) => { setDate(e.target.value); setAvailability("idle"); }} min={new Date().toISOString().slice(0, 10)} />
                </div>
                <div>
                  <Label>Start time</Label>
                  <Select value={time} onChange={(e) => { setTime(e.target.value); setAvailability("idle"); }}>
                    {timeSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label>Package</Label>
                  <div className="mt-2 grid gap-3 md:grid-cols-2">
                    {roomPackages.map((pkg) => (
                      <button key={`${pkg.roomSlug}-${pkg.code}`} onClick={() => setPackageCode(pkg.code)} className={`rounded-2xl border p-4 text-left ${selectedPackage.code === pkg.code ? "border-gold bg-gold/10" : "border-navy-700/10 bg-white"}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div><p className="font-black text-navy-700">{pkg.label}</p><p className="text-sm text-navy-700/60">{pkg.description}</p></div>
                          <p className="font-black text-gold-dark">{formatMYR(pkg.price)}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                {selectedPackage.requiresHourlyInput && (
                  <div>
                    <Label>Total hours</Label>
                    <Input type="number" min={1} max={12} value={hours} onChange={(e) => setHours(Number(e.target.value))} />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-3 rounded-3xl border border-navy-700/10 bg-navy-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 text-sm font-bold text-navy-700"><Clock className="h-5 w-5 text-gold-dark" /> Check slot before payment</div>
                <Button variant={availability === "available" ? "gold" : "default"} onClick={checkAvailability} disabled={availability === "checking"}>
                  {availability === "checking" && <Loader2 className="h-4 w-4 animate-spin" />}
                  {availability === "available" ? "Available" : "Check Availability"}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h2 className="text-2xl font-black text-navy-700">3. Meals, pax & payment option</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Total pax for meals/add-ons</Label>
                  <Input type="number" min={1} max={100} value={pax} onChange={(e) => setPax(Number(e.target.value))} />
                </div>
                <div>
                  <Label>Payment</Label>
                  <Select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}>
                    <option value="deposit_50">Pay 50% deposit</option>
                    <option value="full">Pay full amount</option>
                  </Select>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {addOns.map((item) => (
                  <button key={item.code} onClick={() => toggleAddOn(item.code)} className={`rounded-2xl border p-4 text-left ${selectedAddOns.includes(item.code) ? "border-gold bg-gold/10" : "border-navy-700/10 bg-white"}`}>
                    <div className="flex items-center justify-between gap-4">
                      <div><p className="font-black text-navy-700">{item.label}</p><p className="text-sm text-navy-700/60">{formatMYR(item.price)} / pax</p></div>
                      {selectedAddOns.includes(item.code) && <CheckCircle2 className="h-5 w-5 text-gold-dark" />}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h2 className="text-2xl font-black text-navy-700">4. Customer details & confirmation</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div><Label>Name</Label><Input value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} placeholder="Nama penuh" /></div>
                <div><Label>Phone</Label><Input value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} placeholder="0149556747" /></div>
                <div><Label>Email</Label><Input type="email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} placeholder="nama@email.com" /></div>
                <div><Label>Company / Organisation</Label><Input value={customer.company} onChange={(e) => setCustomer({ ...customer, company: e.target.value })} placeholder="Optional" /></div>
                <div className="md:col-span-2"><Label>Notes</Label><Textarea value={customer.notes} onChange={(e) => setCustomer({ ...customer, notes: e.target.value })} placeholder="Contoh: Susunan meja, jenis program, request makanan..." /></div>
              </div>
            </motion.div>
          )}

          {message && <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{message}</div>}

          <div className="mt-8 flex justify-between gap-3">
            <Button variant="outline" onClick={() => setStep((value) => Math.max(1, value - 1))} disabled={step === 1}>Back</Button>
            {step < 4 ? <Button variant="gold" onClick={() => setStep((value) => Math.min(4, value + 1))}>Continue</Button> : <Button variant="gold" onClick={submitBooking} disabled={submitting}>{submitting && <Loader2 className="h-4 w-4 animate-spin" />} Pay & Confirm</Button>}
          </div>
        </CardContent>
      </Card>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <Card className="overflow-hidden">
          <div className="relative h-56">
            <Image src={room.image} alt={room.name} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="text-2xl font-black">{room.name}</p>
              <p className="text-sm font-bold text-gold-light">{room.capacity}</p>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-navy-700/65"><CalendarDays className="h-4 w-4" /> Date</span><b>{date || "Not selected"}</b></div>
              <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-navy-700/65"><Clock className="h-4 w-4" /> Time</span><b>{time}</b></div>
              <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-navy-700/65"><Users className="h-4 w-4" /> Pax</span><b>{pax}</b></div>
            </div>
            <div className="my-5 h-px bg-navy-700/10" />
            <div className="space-y-3">
              {price.lines.map((line) => (
                <div key={`${line.label}-${line.qty}`} className="flex items-start justify-between gap-4 text-sm">
                  <div><p className="font-bold text-navy-700">{line.label}</p><p className="text-navy-700/55">Qty {line.qty} × {formatMYR(line.unitPrice)}</p></div>
                  <p className="font-black text-navy-700">{formatMYR(line.total)}</p>
                </div>
              ))}
            </div>
            <div className="my-5 h-px bg-navy-700/10" />
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-navy-700/70"><span>Subtotal</span><b>{formatMYR(price.subtotal)}</b></div>
              <div className="flex justify-between text-sm text-navy-700/70"><span>Deposit 50%</span><b>{formatMYR(price.depositAmount)}</b></div>
              <div className="rounded-2xl bg-navy-700 p-4 text-white">
                <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-sm"><CreditCard className="h-4 w-4" /> Pay now</span><b className="text-2xl text-gold-light">{formatMYR(price.payableNow)}</b></div>
              </div>
            </div>
            <p className="mt-4 text-xs leading-5 text-navy-700/55">Payment gateway is ready for Billplz/ToyyibPay. Default project runs in mock payment mode until keys are added.</p>
            <Link href="/" className="mt-4 block text-center text-sm font-bold text-gold-dark hover:underline">Back to homepage</Link>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
