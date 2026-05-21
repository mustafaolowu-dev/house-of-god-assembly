import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.houseofgodassembly.com"),
  title: {
    default: "House of God Assembly Hanover Park IL | Christian Worship, Sermons & Livestream",
    template: "%s | House of God Assembly"
  },
  description:
    "House of God Assembly in Hanover Park, Illinois offers Christian worship services, Holy Spirit Bible teaching, Sunday livestreams, online sermons, prayer requests, ministries, events, and giving.",
  openGraph: {
    type: "website",
    siteName: "House of God Assembly",
    images: ["/assets/online-worship-hero.svg"]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
