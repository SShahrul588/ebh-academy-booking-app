import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { rooms } from "@/lib/data";
import { Button } from "@/components/ui/button";

export function RoomShowcase() {
  return (
    <section id="rooms" className="py-20">
      <div className="premium-container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-gold-dark">Room Showcase</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-navy-700 sm:text-5xl">Pilih ruang yang sesuai untuk program anda</h2>
          <p className="mt-4 text-navy-700/70">Semua ruang hadir dengan kemudahan asas corporate: projector/TV, WiFi, whiteboard, surau, pantry dan parking.</p>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-4">
          {rooms.map((room) => (
            <article key={room.slug} className="group overflow-hidden rounded-[1.75rem] border border-navy-700/10 bg-white shadow-premium">
              <div className="relative h-56 overflow-hidden">
                <Image src={room.image} alt={room.name} fill className="object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute left-4 top-4 rounded-full bg-navy-900/85 px-3 py-1 text-xs font-bold text-white backdrop-blur">{room.capacity}</div>
              </div>
              <div className="p-5">
                <h3 className="text-2xl font-black text-navy-700">{room.name}</h3>
                <p className="mt-2 min-h-16 text-sm leading-6 text-navy-700/70">{room.description}</p>
                <div className="mt-4 space-y-2">
                  {room.highlights.slice(0, 3).map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm font-semibold text-navy-700/80">
                      <CheckCircle2 className="h-4 w-4 text-gold-dark" /> {item}
                    </div>
                  ))}
                </div>
                <Link href={`/booking?room=${room.slug}`} className="mt-5 block">
                  <Button className="w-full" variant="outline">Check Availability <ArrowRight className="h-4 w-4" /></Button>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
