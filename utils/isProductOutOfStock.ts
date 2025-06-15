import { ALL_PRODUCTS_QUERYResult } from "@/sanity.types";

export const isProductOutOfStock = (
  product: ALL_PRODUCTS_QUERYResult[0]
): boolean => {
  if (!product.variants || product.variants.length === 0) {
    return true;
  }

  const totalStock = product.variants.reduce((sum, variant) => {
    return sum + (variant.stock || 0);
  }, 0);

  return totalStock <= 0;
};
