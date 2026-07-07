import { SiteHeader } from "@/components/landing/SiteHeader";
import { Hero } from "@/components/landing/Hero";
import { Facilities } from "@/components/landing/Facilities";
import { RoomShowcase } from "@/components/landing/RoomShowcase";
import { PricingSection } from "@/components/landing/PricingSection";
import { Gallery } from "@/components/landing/Gallery";
import { FAQ } from "@/components/landing/FAQ";
import { LocationCTA } from "@/components/landing/LocationCTA";
import { SiteFooter } from "@/components/landing/SiteFooter";

export default function HomePage() {
  return (
    <main>
      <SiteHeader />
      <Hero />
      <Facilities />
      <RoomShowcase />
      <PricingSection />
      <Gallery />
      <FAQ />
      <LocationCTA />
      <SiteFooter />
      <a href="/booking" className="fixed bottom-4 left-4 right-4 z-50 rounded-2xl bg-gold px-5 py-4 text-center text-sm font-black uppercase tracking-wide text-navy-900 shadow-gold md:hidden">Book Now</a>
    </main>
  );
}
