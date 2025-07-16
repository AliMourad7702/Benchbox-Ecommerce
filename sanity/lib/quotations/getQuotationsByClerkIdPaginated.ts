import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getQuotationsByClerkIdPaginated = async (
  clerkId: string,
  page: number = 1,
  limit: number = 10
) => {
  const offset = (page - 1) * limit;
  const sliceEnd = offset + limit;
  const GET_QUOTATIONS_BY_CLERK_ID_PAGINATED = defineQuery(`
  {
    "items": *[_type=="quote" && user->clerkId == $clerkId] | order(_createdAt desc)[$offset...$limit]{
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
        "category": product->category->{title, slug},
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
  },
    "total": count(*[_type=="quote" && user->clerkId == $clerkId])
      }`);

  try {
    const quotations = await sanityFetch({
      query: GET_QUOTATIONS_BY_CLERK_ID_PAGINATED,
      params: { clerkId, offset, limit: sliceEnd },
    });

    return quotations.data || [];
  } catch (error) {
    console.error("Failed to fetch paginated quotations by clerkId:", error);
    throw error;
  }
};
