import type { Metadata } from "next";
import { Syne, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "HireReady | Break the ATS Filter",
  description:
    "HireReady analyzes your resume against any job description and tells you exactly why you're being rejected — then fixes it. 100% free.",
  keywords: ["resume optimizer", "ATS", "job application", "resume analyzer", "career"],
  openGraph: {
    title: "HireReady | Break the ATS Filter",
    description:
      "Stop getting rejected by robots. Get a detailed ATS match score and AI-powered suggestions to fix your resume. Free forever.",
    type: "website",
    url: "https://hireready.app",
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
        <meta name="theme-color" content="#0B0B12" />
      </head>
      <body
        className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
