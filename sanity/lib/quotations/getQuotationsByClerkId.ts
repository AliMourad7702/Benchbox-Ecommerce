import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getQuotationsByClerkId = async (clerkId: string) => {
  const GET_QUOTATIONS_BY_CLERK_ID = defineQuery(`
  *[_type=="quote" && user->clerkId == $clerkId] | order(_createdAt desc){
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
    const quotations = await sanityFetch({
      query: GET_QUOTATIONS_BY_CLERK_ID,
      params: { clerkId },
    });

    return quotations.data || [];
  } catch (error) {
    console.error("Failed to fetch quotations by clerkId:", error);
    throw error;
  }
};
