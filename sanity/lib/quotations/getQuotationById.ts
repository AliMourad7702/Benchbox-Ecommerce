import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getQuotationById = async (quoteId: string) => {
  const GET_QUOTATION_BY_ID = defineQuery(`
    *[_type == "quote" && _id == $quoteId][0]{
      _id, 
      name, 
      email,
      phone,
      address,
      notes, 
      totalPrice,
      status,
      createdAt, 
      "user": user->_id,
      items[]{
          quantity,
          itemTotal,
          productId,
          productName,
          productSlug,
          baseSku,
          variantLabel,
          variantSku,
          "variantId": variant->_id,
          color{
            colorName,
            colorCode,
            "firstImage": images[0],
            variantPrice,
            stock,
            specs
          }
      }
    }
    `);

  try {
    const quotation = await sanityFetch({
      query: GET_QUOTATION_BY_ID,
      params: { quoteId },
    });

    return quotation.data || null;
  } catch (error) {
    console.error("Failed to fetch quotation by sanity id:", error);
    throw error;
  }
};
