import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getCategoryBySlug = async (slug: string) => {
  const CETEGORY_BY_SLUG_QUERY = defineQuery(`
      *[_type == "category" && slug.current==$slug][0]{
      _id,
      title,
      "imageUrl": image.asset->url,
      description,
      "slug": slug.current
      }
    `);

  try {
    const category = await sanityFetch({
      query: CETEGORY_BY_SLUG_QUERY,
      params: { slug },
    });

    return category.data || null;
  } catch (error) {
    console.error("Error fetching category by slug", error);
    throw error;
  }
};
