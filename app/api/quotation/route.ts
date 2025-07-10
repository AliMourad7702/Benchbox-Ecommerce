import { NextResponse } from "next/server";
import { ProductInBasketType } from "@/components/products/ProductDetails";
import { backendClient } from "@/sanity/lib/backendCLient";
import { v4 as uuidv4 } from "uuid";
import { getSanityUserIdByClerkId } from "@/sanity/lib/users/getSanityUserIdByClerkId";
import { generateQuotePdf } from "@/lib/pdf/generateQuotePdf";
import { sendResendEmailBatch } from "@/lib/email/sendResendEmail";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const doc = {
      _type: "quote",
      isGuest: true,
      name: data.name,
      email: data.email,
      phone: data.phone || "",
      address: data.address,
      notes: data.notes || "",
      totalPrice: data.totalPrice,
      ...(data.clerkId && {
        user: {
          _type: "reference",
          _ref: await getSanityUserIdByClerkId(data.clerkId),
          _weak: true,
        },
      }),
      items: data.items.map((item: ProductInBasketType) => ({
        _key: uuidv4(),
        _type: "item",
        variant: {
          _type: "reference",
          _ref: item.variant._id,
          _weak: true,
        },
        quantity: item.quantity,
        itemTotal: item.variant.color!.price! * item.quantity,
        productId: item.productId,
        productName: item.productName,
        productSlug: item.productSlug,
        baseSku: item.baseSku,
        variantLabel: item.variant.label,
        variantSku: item.variant.sku,

        color: {
          colorName: item.variant.color!.colorName,
          colorCode: item.variant.color!.colorCode,
          images: item.variant.color!.images,
          variantPrice: item.variant.color!.price,
          stock: item.variant.color!.stock,
          specs: item.variant.color!.specs,
        },
      })),
      createdAt: new Date().toISOString(),
      status: "received",
    };

    const createdQuote = await backendClient.create(doc);

    const pdfBuffer = await generateQuotePdf(createdQuote._id);

    await sendResendEmailBatch({
      userEmail: createdQuote.email,
      userContent: {
        subject: "Your BenchBox Quotation",
        html: `<p>Hi ${createdQuote.name},<br/>Thank you for requesting a quotation. Please find your PDF attached.<br/>Our team will reach out to you soon.<br/><br/>Best regards,<br/>BenchBox Team</p>`,
      },
      adminContent: {
        subject: `New Quotation Received from ${createdQuote.name}`,
        html: `<p>A new quotation has been submitted by <strong>${createdQuote.name}</strong>.<br/>Phone: ${createdQuote.phone || "N/A"}<br/>Email: ${createdQuote.email}<br/><br/>The full PDF is attached.</p>`,
      },
      attachment: pdfBuffer,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error creating quote in Sanity:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
