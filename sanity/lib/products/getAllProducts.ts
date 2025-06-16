import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getAllProducts = async () => {
  const ALL_PRODUCTS_QUERY = defineQuery(`
    *[_type == "product"] | order(_updatedAt desc) {
    _id,
    name,
    baseSku,
    "slug": slug.current,
    category->{
      title,
      "slug": slug.current
    },
    variants[]->{
      _id,
      label,
      sku,
      price,
      stock,
      specs,
      colorOptions[]{
          colorName,
          "colorCode": color.hex,
          "images":images[].asset->url
        }
    }
  }
    `);

  try {
    // use sanityFetch to send the query
    const products = await sanityFetch({
      query: ALL_PRODUCTS_QUERY,
    });

    //Return the list of products, or an empty array if none are found
    return products.data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
