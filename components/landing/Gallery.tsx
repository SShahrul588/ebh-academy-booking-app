import Image from "next/image";

const images = [
  ["/images/hero-training.jpg", "Training hall setup"],
  ["/images/meeting-room.jpg", "Meeting room"],
  ["/images/consultant-room.jpg", "Consultant room"],
  ["/images/surau.jpg", "Surau"],
  ["/images/pantry.jpg", "Pantry"],
  ["/images/training-room.jpg", "Training room angle"],
];

export function Gallery() {
  return (
    <section id="gallery" className="py-20">
      <div className="premium-container">
        <div className="max-w-2xl">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-gold-dark">Gallery</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-navy-700 sm:text-5xl">Real space, real facilities</h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map(([src, alt], index) => (
            <div key={src} className={`relative overflow-hidden rounded-3xl shadow-premium ${index === 0 ? "sm:col-span-2" : ""} h-72`}>
              <Image src={src} alt={alt} fill className="object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-900/80 to-transparent p-5 text-white">
                <p className="font-bold">{alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
