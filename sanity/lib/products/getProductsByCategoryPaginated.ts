import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getProductsByCategoryPaginated = async (
  categorySlug: string,
  page: number = 1,
  limit: number = 10
) => {
  const offset = (page - 1) * limit;
  const sliceEnd = offset + limit;

  const PRODUCTS_BY_CATEGORY_QUERY_PAGINATED = defineQuery(`
  {
    "items": *[_type == "product" && category->slug.current == $categorySlug]
      | order(_createdAt desc)[$offset...$limit] {
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
    "total": count(*[_type == "product" && category->slug.current == $categorySlug])
  }
`);

  try {
    const { data } = await sanityFetch({
      query: PRODUCTS_BY_CATEGORY_QUERY_PAGINATED,
      params: {
        categorySlug,
        offset,
        limit: sliceEnd,
      },
    });

    return {
      items: data?.items || [],
      total: data?.total || 0,
    };
  } catch (error) {
    console.error("Error fetching paginated products by category:", error);
    throw error;
  }
};
