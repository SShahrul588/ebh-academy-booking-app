import { Car, Coffee, MapPin, Monitor, Building2, Snowflake, Wifi, ClipboardCheck } from "lucide-react";
import { facilities } from "@/lib/data";

const icons = [MapPin, Monitor, ClipboardCheck, Snowflake, Wifi, Building2, ClipboardCheck, Coffee, Car];

export function Facilities() {
  return (
    <section className="py-16">
      <div className="premium-container">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {facilities.map((item, index) => {
            const Icon = icons[index] || ClipboardCheck;
            return (
              <div key={item} className="glass-card flex items-center gap-4 rounded-3xl p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-navy-700 text-gold"><Icon className="h-6 w-6" /></div>
                <p className="font-bold text-navy-700">{item}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
