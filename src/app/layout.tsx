import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { studio } from "@/data/studio";
import "./globals.css";

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const display = Instrument_Serif({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${studio.name} — Virtual Fitting Room`,
  description: studio.intro,
  openGraph: {
    title: `${studio.name} — Virtual Fitting Room`,
    description: studio.intro,
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
