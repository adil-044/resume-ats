import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HireReady | Elite AI Resume Architect",
  description: "Bypass Applicant Tracking Systems with machine-readable executive resumes. Premium Soft UI optimization for the modern job seeker.",
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
      </head>
      <body
        className={`${plusJakartaSans.variable} ${dmSans.variable} font-sans antialiased bg-[#E0E5EC] text-[#3D4852]`}
      >
        {children}
      </body>
    </html>
  );
}
