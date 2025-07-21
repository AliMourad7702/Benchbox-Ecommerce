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

  const { color, searchTerm, minTotal, maxTotal } = filters;

  const filterConditions = [
    `_type == "product"`,
    `category->slug.current == $categorySlug`,
  ];

  if (color && color !== "") {
    filterConditions.push(`
      count(variants[]->colorOptions[color.hex == $color]) > 0
    `);
  }

  // Search term filter
  if (searchTerm && searchTerm !== "") {
    filterConditions.push(`(
      name match $searchTerm ||
      baseSku match $searchTerm ||
      count(variants[]->sku match $searchTerm) > 0 ||
      count(variants[]->colorOptions[specs[].children[].text match $searchTerm]) > 0
    )`);
  }

  // Price range filter
  if (minTotal !== undefined && !Number.isNaN(minTotal)) {
    filterConditions.push(
      `count(variants[]->colorOptions[price >= $minTotal]) > 0`
    );
  }

  if (maxTotal !== undefined && !Number.isNaN(maxTotal)) {
    filterConditions.push(
      `count(variants[]->colorOptions[price <= $maxTotal]) > 0`
    );
  }

  const colorOptionsConditions: string[] = [];

  if (color) {
    colorOptionsConditions.push(`color.hex == $color`);
  }

  if (minTotal !== undefined && !Number.isNaN(minTotal)) {
    colorOptionsConditions.push(`price >= $minTotal`);
  }

  if (maxTotal !== undefined && !Number.isNaN(maxTotal)) {
    colorOptionsConditions.push(`price <= $maxTotal`);
  }

  const combinedColorOptionsFilter =
    colorOptionsConditions.length > 0
      ? `colorOptions[${colorOptionsConditions.join(" && ")}]`
      : `colorOptions`;

  const filtersString = filterConditions.join(" && ");

  const colorOptionsBasedOnColor =
    colorOptionsConditions.length > 0
      ? `"colorOptions": select(
            ${(color && color.length > 0) || (minTotal !== undefined && !Number.isNaN(minTotal)) || (maxTotal !== undefined && !Number.isNaN(maxTotal))} => ${combinedColorOptionsFilter},
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
        ...(searchTerm ? { searchTerm: `${searchTerm}*` } : {}),
        ...(minTotal !== undefined ? { minTotal } : {}),
        ...(maxTotal !== undefined ? { maxTotal } : {}),
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
