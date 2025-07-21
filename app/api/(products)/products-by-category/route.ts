import { NextRequest, NextResponse } from "next/server";
import { getProductsByCategoryPaginated } from "@/sanity/lib/products/getProductsByCategoryPaginated";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categorySlug = searchParams.get("category");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "8", 10);

  const colorCode = searchParams.get("color");
  const searchTerm = searchParams.get("searchTerm") || undefined;
  const minTotal = searchParams.get("minPrice") || undefined;
  const maxTotal = searchParams.get("maxPrice") || undefined;

  const decodedColorCode = colorCode
    ? decodeURIComponent(colorCode)
    : undefined;

  const decodedSearchTerm = searchTerm
    ? decodeURIComponent(searchTerm)
    : undefined;

  console.log("decoded colorCodes:", decodedColorCode);

  if (!categorySlug) {
    return NextResponse.json({ error: "Missing category" }, { status: 400 });
  }

  try {
    const result = await getProductsByCategoryPaginated(
      categorySlug,
      page,
      limit,
      {
        color:
          decodedColorCode && decodedColorCode !== ""
            ? decodedColorCode
            : undefined,
        searchTerm: decodedSearchTerm ? decodedSearchTerm : undefined,
        minTotal: minTotal ? Number(minTotal) : undefined,
        maxTotal: maxTotal ? Number(maxTotal) : undefined,
      }
    );
    return NextResponse.json(result);
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch products by category slug" },
      { status: 500 }
    );
  }
}
