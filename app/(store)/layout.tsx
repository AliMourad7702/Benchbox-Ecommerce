import type { Metadata } from "next";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/layout/Header";
import { SanityLive } from "@/sanity/lib/live";
import BasketProvider from "@/providers/BasketProvider";
import { Toaster } from "react-hot-toast";

// TODO adjust metadata for all pages (even the dynamic ones) after checking with wassim

export const metadata: Metadata = {
  title: "BenchBox | Premium Office Furniture in Saudi Arabia",
  description: "to be added",
  keywords: [
    "office furniture",
    "office chairs",
    "ergonomic chairs",
    "office desks",
    "workstations",
    "Saudi Arabia",
    "BenchBox",
    "modern office setup",
    "furniture delivery KSA",
  ],
  openGraph: {
    title: "BenchBox | Premium Office Furniture in Saudi Arabia",
    description:
      "Browse a curated collection of ergonomic chairs, desks, and workstations for professional environments. Fast delivery across Saudi Arabia.",
    url: "https://benchbox.sa",
    siteName: "BenchBox",
    locale: "en_SA",
    type: "website",
    images: [
      {
        url: "/images/Benchbox-logo.png",
        width: 1200,
        height: 630,
        alt: "BenchBox Office Furniture",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider dynamic>
      <html lang="en">
        <body className="m-0 bg-gray-100">
          <Toaster
            toastOptions={{
              style: {
                background: "rgb(51 65 85)",
                color: "white",
              },
            }}
          />
          <BasketProvider>
            <main>
              <Header />
              {children}
            </main>
          </BasketProvider>
          <SanityLive />
        </body>
      </html>
    </ClerkProvider>
  );
}
