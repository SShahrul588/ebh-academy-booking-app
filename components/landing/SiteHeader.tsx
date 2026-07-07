import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-white/80 backdrop-blur-xl">
      <div className="premium-container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-navy-700 text-gold shadow-lg">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="leading-tight">
            <p className="text-lg font-black tracking-tight text-navy-700">EBH</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-navy-700/70">Training Academy</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-semibold text-navy-700/75 md:flex">
          <a href="#rooms" className="hover:text-gold-dark">Rooms</a>
          <a href="#pricing" className="hover:text-gold-dark">Pricing</a>
          <a href="#gallery" className="hover:text-gold-dark">Gallery</a>
          <a href="#faq" className="hover:text-gold-dark">FAQ</a>
        </nav>
        <Link href="/booking">
          <Button variant="gold" size="sm">Book Now</Button>
        </Link>
      </div>
    </header>
  );
}
