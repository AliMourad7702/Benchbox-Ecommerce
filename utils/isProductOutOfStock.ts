import { PRODUCT_BY_SLUG_QUERYResult } from "@/sanity.types";

export interface AdjustedVariantType {
  _id: string;
  label: string | null;
  sku: string | null;
  colorOptions: Array<{
    colorName: string | null;
    colorCode: string | null;
    images: Array<string | null> | null;
    price: number | null;
    stock: number | null;
    specs: Array<{
      children?: Array<{
        marks?: Array<string>;
        text?: string;
        _type: "span";
        _key: string;
      }>;
      style?: "blockquote" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "normal";
      listItem?: "bullet" | "number";
      markDefs?: Array<{
        href?: string;
        _type: "link";
        _key: string;
      }>;
      level?: number;
      _type: "block";
      _key: string;
    }> | null;
  }> | null;
}

export const getAllVariantStock = (variant: AdjustedVariantType) => {
  const totalVartiantsStock =
    variant!.colorOptions?.reduce((colorsSum, colorOption) => {
      return colorsSum + colorOption!.stock! || 0;
    }, 0) || 0;

  return totalVartiantsStock;
};

export const isProductOutOfStock = (
  product: PRODUCT_BY_SLUG_QUERYResult
): boolean => {
  if (!product!.variants || product!.variants.length === 0) {
    return true;
  }

  const totalStock = product!.variants.reduce((sum, variant) => {
    return sum + getAllVariantStock(variant);
  }, 0);

  return totalStock <= 0;
};
