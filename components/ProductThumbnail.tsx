import { ALL_PRODUCTS_QUERYResult, Product } from "@/sanity.types";
import { isProductOutOfStock } from "@/utils/isProductOutOfStock";
import Link from "next/link";
import React from "react";
import Carousel from "./Carousel";

interface ProductThumbnailProps {
  product: ALL_PRODUCTS_QUERYResult[0];
}

const ProductThumbnail = ({ product }: ProductThumbnailProps) => {
  return (
    <div
      className={`group flex flex-col rounded-lg border bg-white border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${isProductOutOfStock(product) ? "opacity-50" : ""}`}
    >
      {/* TODO search for a good card component for out product on https://www.reactbits.dev/ */}
      <div className="relative">
        <Carousel
          items={product.variants!}
          baseSku={product.baseSku!}
          baseWidth={250}
          autoplay={product.variants!.length > 1}
          autoplayDelay={3000}
          pauseOnHover={true}
          loop={true}
          round={false}
          parentProductInfo={{ slug: product.slug!, name: product.name ?? "" }}
        />
      </div>
    </div>
  );
};

export default ProductThumbnail;
