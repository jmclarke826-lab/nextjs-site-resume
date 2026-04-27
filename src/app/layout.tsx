import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { contact } from "@/data/careerProfile";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Jessica Clarke Dennis | Professional Profile",
  description:
    "Professional website for Jessica Clarke Dennis featuring career journey, strengths, a Digital Twin chat grounded in her profile, and upcoming portfolio highlights.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Jessica Clarke Dennis | Professional Profile",
    description:
      "Operations and administration professional with experience across office management, medical billing, customer care, and small-business operations.",
    url: "/",
    siteName: "Jessica Clarke Dennis",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Jessica Clarke Dennis | Professional Profile",
    description:
      "Operations and administration professional with a Digital Twin career chat.",
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Jessica Clarke Dennis",
  email: contact.email,
  sameAs: [contact.linkedInUrl],
  jobTitle: "Operations & Administration Professional",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-slate-950">
        <a
          href="#about"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-950"
        >
          Skip to main content
        </a>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <SiteHeader />
        <div className="flex flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
