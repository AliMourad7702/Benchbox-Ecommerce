"use client";
import React from "react";
import { ProductInBasketType, SelectedColorType } from "./ProductDetails";
import {
  AdjustedVariantType,
  getAllVariantStock,
} from "@/utils/isProductOutOfStock";

interface SetVariantProps {
  variants: AdjustedVariantType[];
  productInBasket: ProductInBasketType;

  handleVariantChange: (variant: AdjustedVariantType) => void;
}

const SetVariant: React.FC<SetVariantProps> = ({
  variants,
  productInBasket,
  handleVariantChange,
}) => {
  const isVariantLengthLong = variants![0].label?.length! > 1;
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-semibold">VARIANT:</span>
      <div
        className={`flex ${isVariantLengthLong && "flex-col"} w-full max-w-[30%] gap-1`}
      >
        {variants?.map((item) => {
          return (
            <div
              className={`${isVariantLengthLong ? "h-7 w-40" : `h-7 w-7`} rounded-full border-green-400 flex items-center justify-center relative line-clamp-1 ${productInBasket.variant._id === item?._id ? "border-[1.5px]" : "border-none"}`}
              key={item?._id}
              onClick={() => handleVariantChange(item)}
            >
              <div
                className={`flex justify-center items-center ${isVariantLengthLong ? "h-5 w-38" : `h-5 w-5`} rounded-full border-[1px] border-slate-300 bg-slate-200 hover:cursor-pointer hover:opacity-70 ${getAllVariantStock(item) === 0 && "opacity-50"}`}
              >
                {item.label?.toUpperCase()}
              </div>
              {getAllVariantStock(item) === 0 && (
                <span className="text-red-500 absolute text-2xl select-none hover:cursor-pointer -top-1">
                  X
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SetVariant;
