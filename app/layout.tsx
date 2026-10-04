import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: [
    { path: "./fonts/geist-regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/geist-medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/geist-semibold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/geist-bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-geist-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Busineskal — Products, Services & Business Suppliers",
  description:
    "Discover products, explore services, and meet your next business partner. Busineskal brings buyers and suppliers together in one marketplace.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
