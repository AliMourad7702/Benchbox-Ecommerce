"use client";

import { PRODUCT_BY_SLUG_QUERYResult } from "@/sanity.types";
import { isProductOutOfStock } from "@/utils/isProductOutOfStock";
import { PortableText } from "next-sanity";
import Image from "next/image";
import React from "react";

interface ProductDetailsProps {
  product: PRODUCT_BY_SLUG_QUERYResult;
}

const Horizontal = () => {
  return <hr className="w-[40%] my-2" />;
};

const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
}: ProductDetailsProps) => {
  const isOutOfStock = isProductOutOfStock(product);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div
        className={`relative aspect-square overflow-hidden rounded-lg shadow-lg ${isOutOfStock ? "opacity-50" : ""}`}
      >
        {/* FIXME think about the logic to implement how to showcase each variant and switch between them (and simultaneously switch the necessary info*/}

        {product!.variants && (
          <Image
            src={product!.variants![0].colorOptions![0].images![0]!}
            alt={product!.name ?? "product! Image"}
            fill
            className="object-contain transition-transform duration-300 hover:scale-105"
          />
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black opacity-50">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-4">
            {product!.name ??
              product!.baseSku + "-" + product!.variants![0].label}
          </h1>
          <div className="text-xl font-semibold mb-4">
            SAR {product!.variants![0].price?.toFixed(2)}
          </div>
          <Horizontal />
          <div className="prose max-w-none mb-6">
            {Array.isArray(product!.variants![0].specs) && (
              <PortableText value={product!.variants![0].specs} />
            )}
          </div>
          <Horizontal />
          <div>
            <span>CATEGORY:</span> {product!.category!.title}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
