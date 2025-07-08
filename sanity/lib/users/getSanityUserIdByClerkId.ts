import { defineQuery } from "next-sanity";
import { client } from "../client";
import { sanityFetch } from "../live";

export async function getSanityUserIdByClerkId(
  clerkId: string
): Promise<string> {
  const GET_SANITY_USER_BY_CLERK_ID = defineQuery(`
    *[_type == "user" && clerkId == $clerkId][0]{_id}
    `);

  try {
    const userId = await sanityFetch({
      query: GET_SANITY_USER_BY_CLERK_ID,
      params: { clerkId },
    });

    return userId.data?._id || "";
  } catch (error) {
    console.error("Error fetching user by clerkId", error);
    throw error;
  }
}
