import { NextApiRequest, NextApiResponse } from "next";
import { client } from "@/sanity/lib/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const data = req.body;

  try {
    const doc = {
      _type: "quote",
      isGuest: true,
      name: data.name,
      email: data.email,
      phone: data.phone || "",
      address: data.address,
      notes: data.notes || "",
      totalPrice: data.totalPrice,
      items: data.items.map((item: any) => ({
        _type: "item",
        variant: {
          _type: "reference",
          _ref: item.variant._id,
        },
        quantity: item.quantity,
        itemTotal: item.variant.price * item.quantity,
        productId: item.productId,
        productName: item.productName,
        productSlug: item.productSlug,
        baseSku: item.baseSku,
        variantLabel: item.variant.label,
        variantSku: item.variant.sku,
        variantPrice: item.variant.price,
        color: {
          colorName: item.variant.color.colorName,
          colorCode: item.variant.color.colorCode,
          images: item.variant.color.images,
          stock: item.variant.color.stock,
        },
        specs: item.variant.specs,
      })),
      createdAt: new Date().toISOString(),
      status: "received",
    };

    await client.create(doc);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error creating quote in Sanity:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
