"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, ParkingCircle, Train, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const sellingPoints = [
  { icon: Train, label: "Walking distance MRT Serdang Raya Selatan" },
  { icon: ParkingCircle, label: "Parking available" },
  { icon: Wifi, label: "High-speed WiFi" },
  { icon: MapPin, label: "Strategic location" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-24">
      <div className="absolute inset-x-0 top-0 -z-10 h-[720px] navy-gradient" />
      <div className="premium-container grid items-center gap-10 pb-16 pt-10 lg:grid-cols-[1.02fr_.98fr] lg:pt-16">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Badge className="border-white/20 bg-white/10 text-gold-light">Premium Workspace Rental</Badge>
          <h1 className="mt-5 max-w-3xl text-balance text-5xl font-black uppercase tracking-tight text-white sm:text-6xl lg:text-7xl">
            Workspace <span className="text-gold-light">For Rent</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/78">
            Ruang lengkap, selesa & profesional untuk training, kursus, meeting, coaching dan private consultation. Corporate experience dengan harga fleksibel.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/booking"><Button variant="gold" size="lg">Book Now <ArrowRight className="h-5 w-5" /></Button></Link>
            <a href="#pricing"><Button variant="outline" size="lg" className="border-white/20 bg-white/10 text-white hover:bg-white/20">View Rooms & Pricing</Button></a>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {sellingPoints.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-white backdrop-blur">
                <item.icon className="mb-3 h-6 w-6 text-gold-light" />
                <p className="text-xs font-semibold leading-5">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }} className="relative">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/30 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-3 shadow-premium backdrop-blur">
            <Image src="/images/hero-training.jpg" alt="EBH Training Academy training room" width={1300} height={900} priority className="h-[360px] w-full rounded-[1.5rem] object-cover sm:h-[520px]" />
            <div className="absolute bottom-7 left-7 right-7 rounded-3xl border border-white/20 bg-navy-900/75 p-5 text-white backdrop-blur-xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold-light">EBH Training Academy</p>
              <p className="mt-2 text-2xl font-black">Training Room • Meeting Room • Consultant Room</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
