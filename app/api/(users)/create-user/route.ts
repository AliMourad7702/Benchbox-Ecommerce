// app/api/create-user/route.ts
import { backendClient } from "@/sanity/lib/backendCLient";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = body?.data;

    if (!user || !user.id || !user.email_addresses?.[0]?.email_address) {
      return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
    }

    const newUser = {
      _type: "user",
      clerkId: user.id,
      email: user.email_addresses[0].email_address,
      name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
      role: user.public_metadata?.role || "user",
      joinedAt: new Date(user.created_at).toISOString(),
    };

    const created = await backendClient.create(newUser);

    return NextResponse.json({ success: true, userId: created._id });
  } catch (error) {
    console.error("Error creating Sanity user:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
