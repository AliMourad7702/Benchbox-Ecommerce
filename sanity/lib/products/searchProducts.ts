/**
 * @fileoverview Product search functionality using Sanity.io CMS
 */

import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

/**
 * Searches for products based on search parameters
 * @param searchParams - Search string to match against product fields
 * @returns Promise containing array of matching products
 *
 * The search matches against:
 * - Product name
 * - Base SKU
 * - Category title
 * - Variant specifications
 *
 * Each product result contains:
 * - Product ID
 * - Name
 * - Base SKU
 * - Slug
 * - Category info (title and slug)
 * - Variants including:
 *   - Variant ID
 *   - Label
 *   - SKU
 *   - Price
 *   - Stock
 *   - Specs
 *   - Color options (name, hex code, images)
 */
export const searchProducts = async (searchParams: string) => {
  // Define Sanity query to search products
  const PRODUCT_SEARCH_QUERY = defineQuery(`
    *[_type == "product" && (
        name match $searchParams ||
        baseSku match $searchParams ||
        category->title match $searchParams ||
        count(variants[@->specs[].children[].text match $searchParams])>0
      ) 
    ] | order(_updatedAt desc) {
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
          specs,
          colorOptions[]{
              colorName,
              "colorCode": color.hex,
              "images":images[].asset->url,
              stock,
              
          }
        }
      }
  `);

  try {
    // Execute search query with wildcard suffix (for partial matching)
    const products = await sanityFetch({
      query: PRODUCT_SEARCH_QUERY,
      params: { searchParams: `${searchParams}*` },
    });

    return products.data || [];
  } catch (error) {
    // Log and re-throw any errors
    console.error("Error searching products:", error);
    throw error;
  }
};
