// /sanity/lib/products/searchProducts.ts
import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const searchProductsPaginated = async (
  searchParams: string,
  page: number = 1,
  limit: number = 10
) => {
  const offset = (page - 1) * limit;
  const sliceEnd = offset + limit;

  const PRODUCT_SEARCH_QUERY_PAGINATED = defineQuery(`
  {
    "products": *[
      _type == "product" && (
        name match $searchParams ||
        baseSku match $searchParams ||
        category->title match $searchParams ||
        count(variants[]->colorOptions[specs[].children[].text match $searchParams]) > 0
      )
    ] | order(_updatedAt desc)[$offset...$limit] {
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
    },
    "total": count(*[
      _type == "product" && (
        name match $searchParams ||
        baseSku match $searchParams ||
        category->title match $searchParams ||
        count(variants[]->colorOptions[specs[].children[].text match $searchParams]) > 0
      )
    ])
  }
  `);

  try {
    const { data } = await sanityFetch({
      query: PRODUCT_SEARCH_QUERY_PAGINATED,
      params: {
        searchParams: `${searchParams}*`,
        offset,
        limit: sliceEnd,
      },
    });

    return {
      products: data?.products || [],
      total: data?.total || 0,
    };
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};
