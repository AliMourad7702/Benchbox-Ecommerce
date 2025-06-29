import { getRelatedProductsByFilter } from "@/sanity/lib/products/getRelatedProductsByFilter";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { baseSku, categorySlug, colorName, filterOption } = await req.json();
  try {
    const related = await getRelatedProductsByFilter({
      baseSku,
      categorySlug,
      colorName,
      filterOption,
    });

    return NextResponse.json(related);
  } catch (error) {
    return NextResponse.json({ error: error });
  }
}
