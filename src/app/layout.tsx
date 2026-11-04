import type { Metadata } from "next";
import { studio } from "@/data/studio";
import "./globals.css";

// Typography is Helvetica from the system stack in globals.css — no webfont.

export const metadata: Metadata = {
  title: `${studio.name} — virtual fitting room`,
  description: studio.intro,
  openGraph: {
    title: `${studio.name} — virtual fitting room`,
    description: studio.intro,
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
