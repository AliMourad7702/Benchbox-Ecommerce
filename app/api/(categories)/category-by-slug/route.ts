// app/api/category-by-slug/route.ts

import { getCategoryBySlug } from "@/sanity/lib/categories/getCategoryBySlug";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return new Response(
      JSON.stringify({ error: "Missing 'slug' query parameter" }),
      { status: 400 }
    );
  }

  try {
    const category = await getCategoryBySlug(slug);

    if (!category) {
      return new Response(JSON.stringify({ error: "Category not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(category), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Failed to fetch category:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
