import { PRODUCTS_BY_CATEGORY_QUERY_PAGINATEDResult } from "./../../../sanity.types";
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

  // Build filter conditions
  // const filterConditions = [
  //   `_type == "product"`,
  //   `category->slug.current == $categorySlug`,
  // ];

  // if (color && color !== "") {
  //   filterConditions.push(
  //     `count(variants[]->colorOptions[color.hex == $color]) > 0`
  //   );
  // }

  // const filtersString = filterConditions.join(" && ");

  const PRODUCTS_BY_CATEGORY_QUERY_PAGINATED = defineQuery(`
  {
    "items": *[_type == "product" && category->slug.current == $categorySlug]
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
          "colorOptions": colorOptions[]{
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

  const PRODUCTS_BY_CATEGORY_WITH_COLOR_QUERY_PAGINATED = defineQuery(`
  {
    "items": *[
      _type == "product" &&
      category->slug.current == $categorySlug &&
      count(variants[]->colorOptions[color.hex == $color]) > 0
    ]
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
          "colorOptions": colorOptions[color.hex == $color][]{
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
      _type == "product" &&
      category->slug.current == $categorySlug &&
      count(variants[]->colorOptions[color.hex == $color]) > 0
    ])
  }
`);

  try {
    const query = color
      ? PRODUCTS_BY_CATEGORY_WITH_COLOR_QUERY_PAGINATED
      : PRODUCTS_BY_CATEGORY_QUERY_PAGINATED;
    const params = color
      ? {
          categorySlug,
          color,
        }
      : {
          categorySlug,
        };
    const { data } = await sanityFetch({
      query,
      params,
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
