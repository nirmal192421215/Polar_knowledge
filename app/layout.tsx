import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import PolarAI from "./PolarAI";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "POLARIS | India's Polar Science Knowledge Hub",
  description:
    "Explore India's polar expeditions, real-time NOAA meteorological data, scientific publications, and AI-powered research across Antarctica, Arctic, and the Southern Ocean.",
  openGraph: {
    title: "POLARIS — Polar Science Knowledge & Outreach Portal",
    description:
      "India's unified portal for polar research, live data, publications, and AI exploration.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    "name": "POLARIS — National Polar Science Knowledge Hub",
    "alternateName": "Indian Polar Research Portal",
    "url": "https://polaris.ncpor.res.in",
    "parentOrganization": {
      "@type": "GovernmentOrganization",
      "name": "Ministry of Earth Sciences (MoES), Government of India"
    },
    "subOrganization": {
      "@type": "ResearchOrganization",
      "name": "National Centre for Polar and Ocean Research (NCPOR)"
    },
    "description":
      "Official unified platform for India's polar expeditions, NOAA South Pole observations, peer-reviewed scientific publications, and AI research informatics.",
    "keywords": [
      "Antarctica",
      "Arctic",
      "Southern Ocean",
      "Himalaya",
      "Maitri",
      "Bharati",
      "Himadri",
      "Himansh",
      "NCPOR",
      "MoES"
    ]
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <PolarAI />
      </body>
    </html>
  );
}