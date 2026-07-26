import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Linda Fran 🦋",
  description: "A small interactive experience.",
  openGraph: { title: "Linda Fran 🦋", siteName: "Linda Fran 🦋", description: "A small interactive experience.", type: "website" },
  themeColor: "#050305",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
