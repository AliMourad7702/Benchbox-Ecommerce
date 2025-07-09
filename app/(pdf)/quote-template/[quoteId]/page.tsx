// app/pdf/quote-template/[quoteId]/page.tsx
import { getQuotationById } from "@/sanity/lib/quotations/getQuotationById";
import { GET_QUOTATION_BY_IDResult } from "@/sanity.types";
import Image from "next/image";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface QuoteTemplatePageProps {
  params: {
    quoteId: string;
  };
}

export default async function QuoteTemplatePage({
  params,
}: QuoteTemplatePageProps) {
  const { quoteId } = await params;
  const quotation: GET_QUOTATION_BY_IDResult | null =
    await getQuotationById(quoteId);

  if (!quotation) return notFound();

  return (
    <div className="p-4 text-slate-800 text-sm max-w-6xl mx-auto font-sans bg-white">
      <div className="bg-black p-4 flex justify-center items-center mb-3">
        <Image
          src={"/images/Benchbox-logo.png"}
          alt="Main Logo"
          className="min-w-7"
          width={200}
          height={200}
          priority
        />
      </div>

      <h1 className="text-2xl font-bold mb-2">Quotation</h1>
      <p className="text-sm mb-4">
        Quotation ID:{" "}
        <span className="font-mono font-semibold">{quotation._id}</span>
      </p>

      {/* Customer & Address Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6 w-full">
        <div className="col-span-2">
          <p className="text-sm font-semibold mb-1">Customer Info</p>
          <p>
            <strong>Name:</strong> {quotation.name}
          </p>
          <p>
            <strong>Email:</strong> {quotation.email}
          </p>
          {quotation.phone && (
            <p>
              <strong>Phone:</strong> {quotation.phone}
            </p>
          )}
          <p>
            <strong>Status:</strong> {quotation.status}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(quotation.createdAt!).toLocaleDateString("en-GB")}
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold mb-1">Delivery Address</p>
          <p>{quotation.address?.line1}</p>
          {quotation.address?.line2 && <p>{quotation.address.line2}</p>}
          <p>
            {quotation.address?.city} {quotation.address?.postalCode}
          </p>
          <p>{quotation.address?.country}</p>
        </div>
      </div>

      <hr className="my-6 border-slate-300" />

      {/* Items */}
      <h2 className="text-lg font-semibold mb-4">Requested Items</h2>
      <div className="space-y-5">
        {quotation.items!.map((item, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center border border-slate-200 p-4 rounded-md shadow-sm"
          >
            <div className="flex items-center gap-4">
              {item.color?.firstImage && (
                <div className="relative h-16 w-16 rounded overflow-hidden">
                  <Image
                    src={item.color.firstImage}
                    alt={`item ${index}`}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <p className="font-semibold">{item.variantSku}</p>
                <p className="text-slate-500">{item.color?.colorName}</p>
                <p className="text-slate-500">Quantity: {item.quantity}</p>
              </div>
            </div>
            <div className="mt-3 sm:mt-0 sm:text-right">
              <p className="text-sm text-slate-500">
                Item price: SAR {item.color?.variantPrice?.toFixed(2)}
              </p>
              <p className="text-base font-semibold text-slate-700">
                Subtotal: SAR{" "}
                {(item.color?.variantPrice! * item.quantity!).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <hr className="my-6 border-slate-300" />

      {/* Total */}
      <div className="text-right">
        <p className="text-lg font-bold">
          Total: SAR {quotation.totalPrice!.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
