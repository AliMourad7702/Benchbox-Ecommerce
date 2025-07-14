"use client";

import React from "react";
import { ProductInBasketType, SelectedColorType } from "./ProductDetails";

interface SetColorProps {
  colors: SelectedColorType[] | null;
  productInBasket: ProductInBasketType;
  handleColorSelect: (color: SelectedColorType) => void;
}

const SetColor: React.FC<SetColorProps> = ({
  colors,
  productInBasket,
  handleColorSelect,
}) => {
  console.log("colors of this product: ", colors);
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-semibold">COLOR:</span>
      <div className="flex w-full max-w-[30%] gap-1">
        {colors?.map((item, index) => {
          return (
            <div
              className={`h-7 w-7 rounded-full  flex items-center justify-center relative ${productInBasket.variant.color?.colorName === item?.colorName ? (productInBasket.variant.color?.stock === 0 ? "border-[1.5px] border-red-400" : "border-[1.5px] border-green-400") : "border-none"}`}
              key={index}
              onClick={() => handleColorSelect(item)}
            >
              <div
                style={{ background: item!.colorCode! }}
                className={`flex justify-center items-center  h-5 w-5 rounded-full border-[1px] border-slate-300 hover:cursor-pointer hover:opacity-70 ${item?.stock === 0 && "opacity-50"}`}
              ></div>
              {item?.stock === 0 && (
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

export default SetColor;
