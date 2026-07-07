import Link from "next/link";
import { Coffee, Crown, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addOns } from "@/lib/data";
import { formatMYR } from "@/lib/utils";

const shortTerm = [
  {
    name: "Training Room",
    capacity: "20 pax",
    rows: [
      ["Hourly", "RM80 / jam"],
      ["Half Day (4 jam)", "RM300"],
      ["Full Day (8 jam)", "RM550"],
      ["Full Day + Meals", "RM1,450"],
    ],
  },
  {
    name: "Meeting Room",
    capacity: "8 pax",
    rows: [
      ["Hourly", "RM50 / jam"],
      ["Half Day (4 jam)", "RM180"],
      ["Full Day (8 jam)", "RM350"],
      ["Full Day + Meals", "RM800"],
    ],
  },
  {
    name: "Consultant Room",
    capacity: "Private",
    rows: [
      ["Hourly", "RM30 / jam"],
      ["Half Day (4 jam)", "RM100"],
      ["Full Day (8 jam)", "RM200"],
    ],
  },
];

const longTerm = [
  ["Training Room", "RM1,350", "RM2,000", "RM6,500"],
  ["Meeting Room", "RM850", "RM1,250", "RM3,800"],
  ["Consultant Room", "RM500", "RM750", "RM2,000"],
];

export function PricingSection() {
  return (
    <section id="pricing" className="bg-navy-900 py-20 text-white">
      <div className="premium-container">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-gold-light">Room & Price</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Fleksibel • Berkualiti • Berbaloi</h2>
          </div>
          <Link href="/booking"><Button variant="gold" size="lg">Start Booking</Button></Link>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {shortTerm.map((room) => (
            <Card key={room.name} className="border-white/10 bg-white/95">
              <CardHeader>
                <CardTitle>{room.name}</CardTitle>
                <p className="text-sm font-bold text-gold-dark">{room.capacity}</p>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-navy-700/10 overflow-hidden rounded-2xl border border-navy-700/10">
                  {room.rows.map(([label, price]) => (
                    <div key={label} className="flex items-center justify-between gap-4 bg-white px-4 py-3 text-sm">
                      <span className="font-semibold text-navy-700/75">{label}</span>
                      <span className="font-black text-navy-700">{price}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[.95fr_1.05fr]">
          <Card className="border-white/10 bg-white/95">
            <CardHeader>
              <CardTitle>Long Term Rental</CardTitle>
              <p className="text-sm text-navy-700/65">Weekly / monthly. Weekday tidak termasuk cuti umum.</p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-2xl border border-navy-700/10">
                <table className="w-full min-w-[520px] text-sm">
                  <thead className="bg-navy-700 text-white">
                    <tr>
                      <th className="p-3 text-left">Room</th>
                      <th className="p-3 text-left">3 Hari/Minggu</th>
                      <th className="p-3 text-left">5 Hari/Minggu</th>
                      <th className="p-3 text-left">1 Bulan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-700/10 bg-white text-navy-700">
                    {longTerm.map((row) => (
                      <tr key={row[0]}>
                        {row.map((cell, index) => <td key={cell} className={`p-3 ${index === 0 ? "font-bold" : "font-black"}`}>{cell}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-gold/50 bg-white">
            <div className="absolute right-5 top-5 rounded-full bg-red-600 px-4 py-3 text-center text-xs font-black uppercase text-white">Best<br />Value</div>
            <CardHeader>
              <CardTitle className="flex items-center gap-3"><Crown className="h-6 w-6 text-gold-dark" /> Bundle Package</CardTitle>
              <p className="text-sm text-navy-700/65">Training Room + Meeting Room + Consultant Room all in one day</p>
            </CardHeader>
            <CardContent>
              <div className="rounded-3xl border border-gold/40 bg-gold/10 p-6 text-center">
                <p className="font-bold text-navy-700/60 line-through">Harga Normal RM1,200 / day</p>
                <p className="mt-2 text-sm font-black uppercase tracking-[0.2em] text-red-600">Promo Launch</p>
                <p className="mt-1 text-5xl font-black text-red-600">RM999<span className="text-xl text-navy-700"> / day</span></p>
                <p className="mt-2 text-sm font-semibold text-navy-700/70">Tanpa makan. Add meals RM45/pax.</p>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-navy-700/10 p-4">
                  <p className="text-xs font-bold uppercase text-navy-700/50">Weekly Bundle</p>
                  <p className="mt-1 font-black text-navy-700">3 Hari: RM2,800</p>
                  <p className="font-black text-navy-700">5 Hari: RM4,500</p>
                </div>
                <div className="rounded-2xl border border-navy-700/10 p-4">
                  <p className="text-xs font-bold uppercase text-navy-700/50">Monthly Bundle</p>
                  <p className="mt-1 text-sm font-bold text-navy-700/55 line-through">RM12,000/month</p>
                  <p className="font-black text-red-600">RM9,800/month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {addOns.map((item) => (
              <div key={item.code} className="flex items-center gap-3 rounded-2xl bg-white/10 p-4">
                {item.code.includes("lunch") || item.code.includes("meal") ? <Utensils className="h-6 w-6 text-gold-light" /> : <Coffee className="h-6 w-6 text-gold-light" />}
                <div>
                  <p className="font-bold">{item.label}</p>
                  <p className="text-sm text-white/70">{formatMYR(item.price)} / pax</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
