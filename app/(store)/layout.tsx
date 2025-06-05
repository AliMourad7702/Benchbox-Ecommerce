import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/layout/Navbar";
import { ClerkProvider } from "@clerk/nextjs";

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
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
