import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.ebhacademy.com"),
  title: {
    default: "EBH Training Academy | Premium Workspace, Training Room & Meeting Room Rental",
    template: "%s | EBH Training Academy",
  },
  description:
    "Book premium workspace, training room, meeting room and consultant room at EBH Training Academy, walking distance to MRT Serdang Raya Selatan.",
  openGraph: {
    title: "EBH Training Academy — Workspace for Rent",
    description:
      "Premium room rental for training, kursus, meeting, coaching and private consultation. Navy, gold and corporate experience.",
    url: "https://www.ebhacademy.com",
    siteName: "EBH Training Academy",
    images: [{ url: "/images/hero-training.jpg", width: 1200, height: 630 }],
    locale: "ms_MY",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EBH Training Academy — Workspace for Rent",
    description: "Training room, meeting room and consultant room booking in one premium platform.",
    images: ["/images/hero-training.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#061A3A",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ms">
      <body>{children}</body>
    </html>
  );
}
