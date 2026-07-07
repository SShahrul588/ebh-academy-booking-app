import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LocationCTA() {
  return (
    <section id="location" className="pb-24">
      <div className="premium-container">
        <div className="overflow-hidden rounded-[2rem] navy-gradient p-8 text-white shadow-premium md:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_.8fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.3em] text-gold-light">Ready to book?</p>
              <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Tempah awal untuk tarikh pilihan anda</h2>
              <p className="mt-4 max-w-2xl text-white/75">EBH Training Academy, EBH Group Sdn Bhd. Sesuai untuk training, kursus, mesyuarat, coaching, interview, bengkel dan banyak lagi.</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href="/booking"><Button variant="gold" size="lg">Book Now</Button></Link>
                <a href="https://wa.me/60149556747" target="_blank" rel="noreferrer"><Button variant="outline" size="lg" className="border-white/20 bg-white/10 text-white hover:bg-white/20"><Phone className="h-5 w-5" /> WhatsApp</Button></a>
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
              <MapPin className="h-8 w-8 text-gold-light" />
              <p className="mt-4 text-xl font-black">EBH Training Academy</p>
              <p className="mt-2 text-white/75">EBH Group Sdn Bhd</p>
              <p className="mt-5 rounded-2xl bg-white/10 p-4 font-bold text-gold-light">Walking distance to MRT Serdang Raya Selatan</p>
              <p className="mt-3 text-sm text-white/65">Replace this card with Google Maps embed once the exact Google Maps share URL is ready.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
