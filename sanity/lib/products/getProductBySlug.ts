import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getProductBySlug = async (slug: string) => {
  const PRODUCT_BY_SLUG_QUERY = defineQuery(`
    *[_type == "product" && slug.current==$slug][0]{
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

  const product = await sanityFetch({
    query: PRODUCT_BY_SLUG_QUERY,
    params: { slug },
  });

  return product.data || null;
};
