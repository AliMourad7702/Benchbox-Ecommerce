import { ALL_PRODUCTS_QUERYResult, Product } from "@/sanity.types";
import { isProductOutOfStock } from "@/utils/isProductOutOfStock";
import Link from "next/link";
import React from "react";

interface ProductThumbnailProps {
  product: ALL_PRODUCTS_QUERYResult[0];
}

const ProductThumbnail = ({ product }: ProductThumbnailProps) => {
  return (
    <Link
      href={`/product/${product.slug}`}
      className={`group flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${isProductOutOfStock(product) ? "opacity-50" : ""}`}
    >
      {/* TODO search for a good card component for out product on https://www.reactbits.dev/ */}
      {product.name}
    </Link>
  );
};

export default ProductThumbnail;
