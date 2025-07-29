import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

type CustomSessionClaims = {
  publicMetadata?: {
    role?: string;
  };
};

const isProtectedStudioRoute = createRouteMatcher(["/studio(.*)?"]);
const isRequestedQuotesRoute = createRouteMatcher(["/requested-quotes(.*)?"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  console.log("UserId: ", userId);
  console.log("SessionClaims", sessionClaims);
  const customClaims = sessionClaims as CustomSessionClaims;
  const role = customClaims?.publicMetadata?.role;

  // 🔒 Block non-admins from accessing /studio
  if (isProtectedStudioRoute(req) && (role !== "admin" || !userId)) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // 🔒 Redirect non-logged-in users from accessing /requested-quotes
  if (isRequestedQuotesRoute(req) && !userId) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
