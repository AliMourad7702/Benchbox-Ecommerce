import { getAvailableColorsByCategorySlug } from "@/sanity/lib/products/getAvailableColorsByCategory";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
