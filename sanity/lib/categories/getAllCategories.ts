import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getAllCategories = async () => {
  const ALL_CATEGORIES_QUERY = defineQuery(`
  *[_type == "category"]{
    _id,
    title,
    "imageUrl": image.asset->url,
    description,
    "slug": slug.current
  }
    `);

  try {
    const categories = await sanityFetch({
      query: ALL_CATEGORIES_QUERY,
    });

    return categories.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
