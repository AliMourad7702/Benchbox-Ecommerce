import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getFeaturedCategories = async () => {
  const FEATURED_CATEGORIES_QUERY = defineQuery(`
    *[_type == "category" && featured == true]{
      _id,
      title,
      "imageUrl": image.asset->url,
      description,
      "slug": slug.current
    }
  `);

  try {
    const categories = await sanityFetch({
      query: FEATURED_CATEGORIES_QUERY,
    });

    return categories.data || [];
  } catch (error) {
    console.error("Error fetching featured categories:", error);
    throw error;
  }
};
