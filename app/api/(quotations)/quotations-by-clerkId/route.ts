import { getQuotationsByClerkIdPaginated } from "@/sanity/lib/quotations/getQuotationsByClerkIdPaginated";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const clerkId = searchParams.get("clerkId");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "5", 10);
    const status = searchParams.get("status") || undefined;
    const minTotal = searchParams.get("minPrice") || undefined;
    const maxTotal = searchParams.get("maxPrice") || undefined;

    if (!clerkId || clerkId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    console.log(
      "mintotal:",
      minTotal,
      "maxtotal:",
      maxTotal,
      "status:",
      status
    );

    const { items, total } = await getQuotationsByClerkIdPaginated(
      clerkId,
      page,
      limit,
      {
        status,
        minTotal: minTotal ? Number(minTotal) : undefined,
        maxTotal: maxTotal ? Number(maxTotal) : undefined,
      }
    );

    return NextResponse.json({ items, total });
  } catch (error) {
    console.error("Error in /api/quotations-by-clerkId:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
