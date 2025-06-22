import type { Metadata } from "next";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/layout/Header";
import { SanityLive } from "@/sanity/lib/live";
import BasketProvider from "@/providers/BasketProvider";

export const metadata: Metadata = {
  title: "BenchBox",
  // TODO add description
  description: "to be added",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider dynamic>
      <html lang="en">
        <body className="m-0">
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
