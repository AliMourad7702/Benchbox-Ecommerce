"use client";

import React from "react";
import { ProductInBasketType } from "../products/ProductDetails";
import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";
import SetQuantity from "../products/SetQuantity";
import { useBasket } from "@/hooks/useBasket";

interface BasketProductContentProps {
  product: ProductInBasketType;
}

const BasketProductContent: React.FC<BasketProductContentProps> = ({
  product,
}) => {
  const { handleRemoveProductFromBasket, handleQuantityChange } = useBasket();

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 text-xs md:text-sm gap-4 border-t-[1.5px] border-slate-200 py-4 items-center">
      <div className="flex md:justify-self-start col-span-2 gap-2 md:gap-4">
        <Link
          href={{
            pathname: `/product/${product?.productSlug}`,
            query: {
              variant: product.variant.label,
              color: product.variant.color?.colorName,
            },
          }}
        >
          <div className="relative w-[70px] aspect-square">
            <Image
              src={product?.variant.color?.images![0]!}
              alt={
                product?.variant!._id +
                " " +
                product?.variant.color?.colorName +
                " image"
              }
              fill
              className="object-contain rounded transition-transform duration-300 hover:scale-105"
            />
          </div>
        </Link>
        <div className="flex flex-col justify-between">
          <Link
            href={{
              pathname: `/product/${product?.productSlug}`,
              query: {
                variant: product.variant.label,
                color: product.variant.color?.colorName,
              },
            }}
            className="truncate hover:text-slate-500 font-medium"
          >
            {product?.productName ?? product?.productSlug}
          </Link>
          <div className="text-slate-500 text-xs">
            {product?.variant.color?.colorName}
          </div>
          <button
            className="text-slate-500 w-fit text-sm text-start underline underline-offset-2 hover:cursor-pointer hover:text-slate-800"
            onClick={() => handleRemoveProductFromBasket(product)}
          >
            Remove
          </button>
        </div>
      </div>
      <div className="md:justify-self-center ">
        <span className="md:hidden font-semibold">Variant: </span>
        {product?.variant.label}
      </div>
      <div className="md:justify-self-center ">
        <span className="md:hidden font-semibold">Price: </span>
        SAR {product?.variant.color!.price?.toFixed(2)}
      </div>
      <div className="md:justify-self-center flex gap-2 items-center">
        <span className="md:hidden font-semibold mb-">Qty: </span>
        <SetQuantity
          isBasket
          productInBasket={product!}
          handleQuantityChange={handleQuantityChange}
        />
      </div>
      <div className="md:justify-self-end">
        <span className="md:hidden font-semibold">Total: </span>
        SAR {(product?.quantity! * product?.variant.color!.price!).toFixed(2)}
      </div>
    </div>
  );
};

export default BasketProductContent;
