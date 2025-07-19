import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";
import { Filters } from "../quotations/getQuotationsByClerkIdPaginated";

export const getProductsByCategoryPaginated = async (
  categorySlug: string,
  page: number = 1,
  limit: number = 10,
  filters: Filters = {}
) => {
  const offset = (page - 1) * limit;
  const sliceEnd = offset + limit;

  const { color } = filters;

  const filterConditions = [
    `_type == "product"`,
    `category->slug.current == $categorySlug`,
  ];

  if (color && color !== "") {
    filterConditions.push(`
      count(variants[]->colorOptions[color.hex == $color]) > 0
    `);
  }

  const filtersString = filterConditions.join(" && ");

  const colorOptionsBasedOnColor =
    color !== undefined && color !== ""
      ? `"colorOptions": select(
            ${color && color.length > 0} => colorOptions[color.hex == $color],
            true => colorOptions
          )[] `
      : "colorOptions[]";

  const PRODUCTS_BY_CATEGORY_QUERY_PAGINATED = defineQuery(`
  {
    "items": *[${filtersString}]
      | order(_createdAt desc)[${offset}...${sliceEnd}] {
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
          ${colorOptionsBasedOnColor}{
            colorName,
            "colorCode": color.hex,
            "images": images[].asset->url,
            price,
            stock,
            specs,
          }
        }
    },
    "total": count(*[${filtersString}])
  }
`);

  try {
    const { data } = await sanityFetch({
      query: PRODUCTS_BY_CATEGORY_QUERY_PAGINATED,
      params: {
        categorySlug,
        ...(color && color !== "" ? { color } : {}),
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
