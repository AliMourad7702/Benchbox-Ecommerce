import { getAvailableColorsByCategorySlug } from "@/sanity/lib/products/getAvailableColorsByCategory";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category");

    if (!categorySlug) {
      return NextResponse.json(
        { error: "Category slug not provided" },
        { status: 403 }
      );
    }

    const availableColors =
      await getAvailableColorsByCategorySlug(categorySlug);

    return NextResponse.json(availableColors);
  } catch (error) {
    console.error("Error in /api/colors-by-category:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
