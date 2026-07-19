import type { Metadata } from "next";
import { Instrument_Serif, Source_Sans_3, JetBrains_Mono, Syne, DM_Sans } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-source",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

/* Kept for dashboard / legacy pages until pass 2 */
const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "HireReady | Break the ATS Filter",
  description:
    "HireReady analyzes your resume against any job description and tells you exactly why you're being rejected — then fixes it. 100% free.",
  keywords: ["resume optimizer", "ATS", "job application", "resume analyzer", "career"],
  openGraph: {
    title: "HireReady | Break the ATS Filter",
    description:
      "Stop getting rejected by robots. Get a detailed ATS match score and AI-powered suggestions to fix your resume. Free forever.",
    type: "website",
    url: SITE_URL,
    siteName: "HireReady",
  },
  twitter: {
    card: "summary_large_image",
    title: "HireReady | Break the ATS Filter",
    description:
      "Stop getting rejected by robots. Get a detailed ATS match score and AI-powered suggestions. Free forever.",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#0C0C0B" />
      </head>
      <body
        className={`${instrument.variable} ${sourceSans.variable} ${jetbrainsMono.variable} ${syne.variable} ${dmSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
