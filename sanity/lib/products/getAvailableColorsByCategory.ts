import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getAvailableColorsByCategorySlug = async (slug: string) => {
  const GET_AVAILABLE_COLORS_BY_CATEGORY_SLUG_QUERY = defineQuery(`
    *[_type == "product" && category->slug.current == $slug]{
    variants[]->{
      colorOptions[]{
        "colorCode": color.hex
      }
    }
  }
  `);

  try {
    const result = await sanityFetch({
      query: GET_AVAILABLE_COLORS_BY_CATEGORY_SLUG_QUERY,
      params: { slug },
    });

    const uniqueColors = [
      ...new Set(
        result.data
          ?.flatMap((product: any) =>
            product.variants?.flatMap((variant: any) =>
              variant.colorOptions?.map((option: any) => option.colorCode)
            )
          )
          .filter(Boolean)
      ),
    ];

    return uniqueColors;
  } catch (error) {
    console.error("Error fetching colors:", error);
    throw error;
  }
};
