"use client";

import { PRODUCT_BY_SLUG_QUERYResult } from "@/sanity.types";
import { isProductOutOfStock } from "@/utils/isProductOutOfStock";
import { PortableText } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useState } from "react";
import { Button } from "../ui/button";
import SetColor from "./SetColor";
import SetQuantity from "./SetQuantity";

interface ProductDetailsProps {
  product: PRODUCT_BY_SLUG_QUERYResult;
}

// FIXME modify this if it caused future errors
export type ProductInBasketType = {
  productId: string;
  baseSku: string;
  productSlug: string;
  productName?: string | null;
  variant: {
    id: string;
    label: string | null;
    sku: string | null;
    price: number | null;
    color: SelectedColorType;
    stock: number | null;
  };
  quantity: number;
};

export type SelectedColorType = {
  colorName: string | null;
  colorCode: string | null;
  images: Array<string | null> | null;
} | null;

const Horizontal = () => {
  return <hr className="w-[30%] my-2" />;
};

const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
}: ProductDetailsProps) => {
  const [productInBasket, setProductInBasket] = useState<ProductInBasketType>({
    productId: product!._id,
    baseSku: product!.baseSku!,
    productSlug: product!.slug!,
    productName: product!.name,
    variant: {
      id: product!.variants![0]._id,
      label: product!.variants![0].label,
      sku: product!.variants![0].sku,
      price: product!.variants![0].price,
      stock: product!.variants![0].stock,
      color: {
        colorName: product!.variants![0].colorOptions![0].colorName,
        colorCode: product!.variants![0].colorOptions![0].colorCode,
        images: product!.variants![0].colorOptions![0].images,
      },
    },
    quantity: 1,
  });

  const isOutOfStock = isProductOutOfStock(product);

  console.log("Product In Basket: ", productInBasket);

  const handleColorSelect = useCallback(
    (color: SelectedColorType) => {
      setProductInBasket((prev) => {
        return {
          ...prev,
          variant: {
            ...prev.variant,
            color: color,
          },
        };
      });
    },
    [productInBasket.variant.color]
  );

  const handleQuantityChange = useCallback(
    (action: "increase" | "decrease") => {
      setProductInBasket((prev) => {
        return {
          ...prev,
          quantity:
            action === "increase"
              ? prev.quantity < prev.variant.stock!
                ? prev.quantity++
                : prev.quantity
              : prev.quantity > 0
                ? prev.quantity--
                : 0,
        };
      });
    },
    [productInBasket.quantity]
  );

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
          <div className="prose max-w-none mb-6 text-black">
            {Array.isArray(product!.variants![0].specs) && (
              <PortableText value={product!.variants![0].specs} />
            )}
          </div>
          <Horizontal />
          <div className="text-sm">
            <Link
              href={`/category/${product!.category!.slug}`}
              className="hover:opacity-50"
            >
              <span className="font-semibold">CATEGORY:</span>{" "}
              {product!.category!.title}
            </Link>
          </div>
          <div className="text-sm">
            <span className="font-semibold">SKU / Model Number:</span>{" "}
            {product!.baseSku}
          </div>
          <div className="text-sm">
            <span className="font-semibold">Availability:</span>{" "}
            <span
              className={
                product!.variants![0].stock! === 0
                  ? "text-red-400"
                  : "text-green-400"
              }
            >
              {product!.variants![0].stock! === 0 ? "Out of Stock" : "In Stock"}
            </span>
          </div>
          <Horizontal />
          <div className="text-sm">
            {/* TODO implement variant component here */}
            variant
          </div>
          <Horizontal />
          <SetColor
            productInBasket={productInBasket}
            colors={product!.variants![0].colorOptions!}
            handleColorSelect={handleColorSelect}
          />
          <Horizontal />
          <div className="text-sm">
            <SetQuantity
              productInBasket={productInBasket}
              handleQuantityChange={handleQuantityChange}
              quantity={1}
            />
          </div>
          <Horizontal />
          <Button
            className="bg-blue-500 hover:bg-blue-700 hover:opacity-50 w-full max-w-[60%] sm:max-w-[30%]"
            size={"lg"}
          >
            Add to Basket
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
