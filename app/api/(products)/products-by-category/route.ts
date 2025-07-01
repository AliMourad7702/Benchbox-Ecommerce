import { NextRequest, NextResponse } from "next/server";
import { getProductsByCategoryPaginated } from "@/sanity/lib/products/getProductsByCategoryPaginated";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categorySlug = searchParams.get("category");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "8", 10);

  if (!categorySlug) {
    return NextResponse.json({ error: "Missing category" }, { status: 400 });
  }

  try {
    const result = await getProductsByCategoryPaginated(
      categorySlug,
      page,
      limit
    );
    return NextResponse.json(result);
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
