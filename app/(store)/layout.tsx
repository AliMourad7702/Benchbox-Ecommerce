import type { Metadata } from "next";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/layout/Header";
import { SanityLive } from "@/sanity/lib/live";
import BasketProvider from "@/providers/BasketProvider";
import { Toaster } from "react-hot-toast";

// TODO adjust metadata for all pages (even the dynamic ones) after checking with wassim

export const metadata: Metadata = {
  title: "BenchBox",
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
