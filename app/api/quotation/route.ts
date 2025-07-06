import { NextResponse } from "next/server";
import { ProductInBasketType } from "@/components/products/ProductDetails";
import { backendClient } from "@/sanity/lib/backendCLient";
import { v4 as uuidv4 } from "uuid";

// TODO add user field

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
      items: data.items.map((item: ProductInBasketType) => ({
        _key: uuidv4(),
        _type: "item",
        variant: {
          _type: "reference",
          _ref: item.variant._id,
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

    await backendClient.create(doc);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error creating quote in Sanity:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
