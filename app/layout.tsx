import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://ebh-academy-booking-app.netlify.app";

const siteName = "EBH Training Academy";
const defaultTitle =
  "EBH Training Academy | Training Room, Meeting Room & Workspace Rental";
const defaultDescription =
  "Tempah training room, meeting room, consultant room dan premium workspace di EBH Training Academy. Sesuai untuk kursus, kelas, coaching, seminar kecil, mesyuarat dan private consultation.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },

  description: defaultDescription,
  applicationName: siteName,

  keywords: [
    "EBH Training Academy",
    "training room rental",
    "meeting room rental",
    "workspace for rent",
    "room rental Seri Kembangan",
    "training room Seri Kembangan",
    "meeting room Seri Kembangan",
    "bilik latihan untuk disewa",
    "bilik meeting untuk disewa",
    "tempah training room",
    "sewa training room",
    "sewa meeting room",
    "consultant room rental",
    "premium workspace rental",
    "kursus",
    "coaching",
    "seminar",
    "private consultation",
    "MRT Serdang Raya Selatan",
  ],

  authors: [{ name: "EBH Training Academy" }],
  creator: "EBH Training Academy",
  publisher: "EBH Training Academy",

  alternates: {
    canonical: siteUrl,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  // NOTE: og:image / twitter:image are generated automatically by Next.js
  // from src/app/images/opengraph-whatsapp.jpg.jpg — no manual image URLs needed.
  openGraph: {
    type: "website",
    locale: "ms_MY",
    url: siteUrl,
    siteName,
    title: "EBH Training Academy — Premium Workspace for Rent",
    description:
      "Book training room, meeting room dan consultant room dengan mudah. Sesuai untuk kelas, kursus, coaching, mesyuarat dan private consultation.",
  },

  twitter: {
    card: "summary_large_image",
    title: "EBH Training Academy — Premium Workspace for Rent",
    description:
      "Tempah training room, meeting room dan consultant room secara online di EBH Training Academy.",
  },

  category: "Workspace Rental",

  other: {
    "geo.region": "MY-10",
    "geo.placename": "Seri Kembangan, Selangor, Malaysia",
    "business:contact_data:locality": "Seri Kembangan",
    "business:contact_data:region": "Selangor",
    "business:contact_data:country_name": "Malaysia",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#061A3A",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "EBH Training Academy",
  url: siteUrl,
  image: `${siteUrl}/images/opengraph-whatsapp.jpg`,
  description: defaultDescription,
  telephone: "+60149556747",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Seri Kembangan",
    addressRegion: "Selangor",
    addressCountry: "MY",
  },
  areaServed: [
    "Seri Kembangan",
    "Selangor",
    "Kuala Lumpur",
    "Putrajaya",
    "Cyberjaya",
  ],
  makesOffer: [
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Training Room Rental",
        description:
          "Premium training room for kursus, kelas, seminar kecil and coaching session.",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Meeting Room Rental",
        description:
          "Meeting room rental for business meetings, discussion and consultation.",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Consultant Room Rental",
        description:
          "Private consultant room for one-to-one consultation and appointment.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ms">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        {children}
      </body>
    </html>
  );
}
