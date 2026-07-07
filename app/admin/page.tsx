import { SiteHeader } from "@/components/landing/SiteHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const dashboardItems = [
  "View all bookings",
  "Filter by date, room and status",
  "Approve / cancel booking",
  "Block dates or maintenance slots",
  "Edit pricing and packages",
  "Export CSV",
  "Manual create booking",
  "Sync with Google Calendar",
];

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-navy-50 pt-24">
      <SiteHeader />
      <section className="premium-container pb-20">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-gold-dark">Admin Dashboard</p>
          <h1 className="mt-3 text-4xl font-black text-navy-700">EBH Academy Operations</h1>
          <p className="mt-4 text-navy-700/70">Starter admin screen. Connect Supabase Auth + RLS before production access.</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {dashboardItems.map((item) => (
            <Card key={item}>
              <CardHeader><CardTitle className="text-lg">{item}</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-navy-700/60">Ready module placeholder.</p></CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
