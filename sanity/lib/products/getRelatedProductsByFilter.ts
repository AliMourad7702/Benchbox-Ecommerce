import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

// TODO add color hex code support
export const getRelatedProductsByFilter = async ({
  baseSku,
  categorySlug,
  colorName,
  filterOption,
}: {
  baseSku: string;
  categorySlug: string;
  colorName: string;
  filterOption: "category" | "color";
}) => {
  const RELATED_PRODUCTS_QUERY = defineQuery(`
    *[
      _type == "product" &&
      baseSku != $baseSku &&
      (
        $filterOption == "category" && category->slug.current==$categorySlug ||
        $filterOption == "color" &&
        count(variants[]->colorOptions[colorName==$colorName])>0
      ) 
    ][0...4]{
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
        "colorOptions": select(
        $filterOption == "color" => colorOptions[colorName == $colorName],
        true => colorOptions
      )[]{
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
    const filteredProducts = await sanityFetch({
      query: RELATED_PRODUCTS_QUERY,
      params: {
        baseSku,
        categorySlug,
        colorName,
        filterOption,
      },
    });

    return filteredProducts.data || [];
  } catch (error) {
    console.error("Error filtering related products", error);
    throw error;
  }
};
