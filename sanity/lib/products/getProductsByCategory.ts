import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getProductsByCategory = async (categorySlug: string) => {
  const PRODUCTS_BY_CATEGORY_QUERY = defineQuery(`
    *[_type == "product" && category->slug.current == $categorySlug] | order(_createdAt desc)[0...4]{
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
        colorOptions[] {
          colorName,
          "colorCode": color.hex,
          "images": images[].asset->url,
          price,
          stock,
          specs,
        }
      }
    }
    `);

  try {
    const products = await sanityFetch({
      query: PRODUCTS_BY_CATEGORY_QUERY,
      params: { categorySlug },
    });

    return products.data || [];
  } catch (error) {
    console.error("Error fetching products by category", error);
    throw error;
  }
};
