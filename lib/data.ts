import type { AddOn, PackageOption, Room } from "@/types";

export const rooms: Room[] = [
  {
    slug: "training-room",
    name: "Training Room",
    capacity: "20 pax",
    description: "Ruang latihan premium untuk seminar, kursus, onboarding dan bengkel pasukan.",
    image: "/images/training-room.jpg",
    highlights: ["20 pax", "Projector / TV", "Whiteboard", "Aircond", "High-speed WiFi"],
  },
  {
    slug: "meeting-room",
    name: "Meeting Room",
    capacity: "8 pax",
    description: "Bilik mesyuarat profesional untuk discussion, board meeting, interview dan coaching.",
    image: "/images/meeting-room.jpg",
    highlights: ["8 pax", "Private setting", "Whiteboard", "WiFi", "Aircond"],
  },
  {
    slug: "consultant-room",
    name: "Consultant Room",
    capacity: "Private",
    description: "Ruang private discussion untuk konsultasi, closing session dan one-to-one meeting.",
    image: "/images/consultant-room.jpg",
    highlights: ["Private", "Professional desk", "Quiet room", "WiFi", "Aircond"],
  },
  {
    slug: "bundle-all-rooms",
    name: "Bundle Package",
    capacity: "All rooms",
    description: "Training Room + Meeting Room + Consultant Room dalam satu hari, sesuai untuk program penuh.",
    image: "/images/hero-training.jpg",
    highlights: ["All in 1 day", "Best value", "Promo launch", "Add meals optional"],
  },
];

export const packages: PackageOption[] = [
  { code: "hourly", roomSlug: "training-room", label: "Hourly", description: "RM80 / jam", price: 80, type: "short_term", requiresHourlyInput: true },
  { code: "half-day", roomSlug: "training-room", label: "Half Day", description: "4 jam", durationHours: 4, price: 300, type: "short_term" },
  { code: "full-day", roomSlug: "training-room", label: "Full Day", description: "8 jam tanpa makan", durationHours: 8, price: 550, type: "short_term" },
  { code: "full-day-meals", roomSlug: "training-room", label: "Full Day + Meals", description: "20 pax, 2 tea break + lunch", durationHours: 8, price: 1450, type: "short_term", includesMeals: true },
  { code: "weekly-3", roomSlug: "training-room", label: "3 Hari / Minggu", description: "Long term weekly", price: 1350, type: "long_term" },
  { code: "weekly-5", roomSlug: "training-room", label: "5 Hari / Minggu", description: "Long term weekly", price: 2000, type: "long_term" },
  { code: "monthly-weekday", roomSlug: "training-room", label: "1 Bulan Weekday", description: "Isnin-Jumaat", price: 6500, type: "long_term" },

  { code: "hourly", roomSlug: "meeting-room", label: "Hourly", description: "RM50 / jam", price: 50, type: "short_term", requiresHourlyInput: true },
  { code: "half-day", roomSlug: "meeting-room", label: "Half Day", description: "4 jam", durationHours: 4, price: 180, type: "short_term" },
  { code: "full-day", roomSlug: "meeting-room", label: "Full Day", description: "8 jam tanpa makan", durationHours: 8, price: 350, type: "short_term" },
  { code: "full-day-meals", roomSlug: "meeting-room", label: "Full Day + Meals", description: "8 pax, 2 tea break + lunch", durationHours: 8, price: 800, type: "short_term", includesMeals: true },
  { code: "weekly-3", roomSlug: "meeting-room", label: "3 Hari / Minggu", description: "Long term weekly", price: 850, type: "long_term" },
  { code: "weekly-5", roomSlug: "meeting-room", label: "5 Hari / Minggu", description: "Long term weekly", price: 1250, type: "long_term" },
  { code: "monthly-weekday", roomSlug: "meeting-room", label: "1 Bulan Weekday", description: "Isnin-Jumaat", price: 3800, type: "long_term" },

  { code: "hourly", roomSlug: "consultant-room", label: "Hourly", description: "RM30 / jam", price: 30, type: "short_term", requiresHourlyInput: true },
  { code: "half-day", roomSlug: "consultant-room", label: "Half Day", description: "4 jam", durationHours: 4, price: 100, type: "short_term" },
  { code: "full-day", roomSlug: "consultant-room", label: "Full Day", description: "8 jam", durationHours: 8, price: 200, type: "short_term" },
  { code: "weekly-3", roomSlug: "consultant-room", label: "3 Hari / Minggu", description: "Long term weekly", price: 500, type: "long_term" },
  { code: "weekly-5", roomSlug: "consultant-room", label: "5 Hari / Minggu", description: "Long term weekly", price: 750, type: "long_term" },
  { code: "monthly-weekday", roomSlug: "consultant-room", label: "1 Bulan Weekday", description: "Isnin-Jumaat", price: 2000, type: "long_term" },

  { code: "bundle-day", roomSlug: "bundle-all-rooms", label: "All In 1 Day", description: "Promo launch without meals", durationHours: 8, price: 999, type: "bundle" },
  { code: "bundle-weekly-3", roomSlug: "bundle-all-rooms", label: "Weekly 3 Hari", description: "All rooms", price: 2800, type: "bundle" },
  { code: "bundle-weekly-5", roomSlug: "bundle-all-rooms", label: "Weekly 5 Hari", description: "All rooms", price: 4500, type: "bundle" },
  { code: "bundle-monthly", roomSlug: "bundle-all-rooms", label: "Monthly Corporate Rate", description: "Full weekday access", price: 9800, type: "bundle" },
];

export const addOns: AddOn[] = [
  { code: "coffee-tea", label: "Coffee / Tea", price: 8, unit: "pax" },
  { code: "tea-break", label: "Tea Break", price: 12, unit: "pax" },
  { code: "lunch", label: "Lunch Packed/Food", price: 25, unit: "pax" },
  { code: "full-day-meal", label: "Full Day Meal Package", price: 45, unit: "pax" },
];

export const facilities = [
  "Walking distance to MRT Serdang Raya Selatan",
  "Projector / TV",
  "Whiteboard",
  "Aircond",
  "High-speed WiFi",
  "Surau",
  "Toilet",
  "Pantry",
  "Parking available",
];
