import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export interface Filters {
  status?: string;
  minTotal?: number;
  maxTotal?: number;
  searchTerm?: string;
  color?: string;
}

export const getQuotationsByClerkIdPaginated = async (
  clerkId: string,
  page = 1,
  limit = 10,
  filters: Filters = {}
) => {
  const offset = (page - 1) * limit;
  const sliceEnd = offset + limit;
  const { status, minTotal, maxTotal, searchTerm } = filters;

  console.log("Filters in sanity function: ", filters);

  const statusArray = status ? status.split(",").map((s) => s.trim()) : [];

  // --- Dynamically build filter conditions ---
  const filterConditions = [`_type == "quote"`, `user->clerkId == $clerkId`];

  if (statusArray.length > 0) filterConditions.push(`status in $statusArray`);

  if (minTotal !== undefined && !Number.isNaN(minTotal))
    filterConditions.push(`totalPrice >= $minTotal`);

  if (maxTotal !== undefined && !Number.isNaN(minTotal))
    filterConditions.push(`totalPrice <= $maxTotal`);

  if (searchTerm) {
    filterConditions.push(`_id match $searchTerm`);
  }

  const filtersString = filterConditions.join(" && ");

  // --- GROQ Query ---
  const GET_QUOTATIONS_BY_CLERK_ID_PAGINATED = defineQuery(`
  {
    "items": *[${filtersString}] | order(_createdAt desc)[${offset}...${sliceEnd}] {
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
    "total": count(*[${filtersString}])
  }`);

  // --- Parameters ---
  const params: Record<string, any> = {
    clerkId,
    ...(statusArray.length > 0 && { statusArray }),
    ...(minTotal !== undefined && { minTotal }),
    ...(maxTotal !== undefined && { maxTotal }),
    ...(searchTerm && { searchTerm: `*${searchTerm}*` }),
  };

  // --- Fetch ---
  try {
    const quotations = await sanityFetch({
      query: GET_QUOTATIONS_BY_CLERK_ID_PAGINATED,
      params,
    });

    return quotations.data || [];
  } catch (error) {
    console.error("Failed to fetch paginated quotations by clerkId:", error);
    throw error;
  }
};
