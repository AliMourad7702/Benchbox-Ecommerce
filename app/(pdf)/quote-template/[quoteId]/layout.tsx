import type { ReactNode } from "react";
import "../../../globals.css";
export default function QuoteTemplateLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Quotation PDF | BenchBox</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <style>{`
          body {
            font-family: 'Inter', sans-serif;
            background: white;
            color: #1e293b; /* slate-800 */
            margin: 0;
            padding: 0;
          }

          @page {
            margin: 1.5cm;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        `}</style>
      </head>
      <body>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
