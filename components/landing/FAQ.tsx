const faqs = [
  ["Boleh book hourly?", "Boleh. Training Room RM80/jam, Meeting Room RM50/jam dan Consultant Room RM30/jam tertakluk kepada availability."],
  ["Adakah makanan disediakan?", "Ya. Add-on coffee/tea, tea break, lunch dan full day meal package boleh dipilih semasa booking."],
  ["Booking confirm bila?", "Booking dikira confirmed selepas bayaran deposit 50% atau full payment berjaya diterima."],
  ["Boleh buat long term rental?", "Boleh. Sistem menyokong weekly 3 hari, weekly 5 hari dan monthly weekday access."],
  ["Ada parking dan MRT?", "Ya. Parking available dan lokasi walking distance ke MRT Serdang Raya Selatan."],
];

export function FAQ() {
  return (
    <section id="faq" className="py-20">
      <div className="premium-container max-w-4xl">
        <div className="text-center">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-gold-dark">FAQ</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-navy-700">Soalan biasa sebelum booking</h2>
        </div>
        <div className="mt-10 space-y-4">
          {faqs.map(([q, a]) => (
            <details key={q} className="group rounded-3xl border border-navy-700/10 bg-white p-6 shadow-premium">
              <summary className="cursor-pointer list-none text-lg font-black text-navy-700 group-open:text-gold-dark">{q}</summary>
              <p className="mt-3 leading-7 text-navy-700/70">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
