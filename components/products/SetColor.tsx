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
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-semibold">COLOR:</span>
      <div className="flex w-full max-w-[30%] gap-1">
        {colors?.map((item) => {
          console.log(item?.colorName + ": ", item?.colorCode);
          return (
            <div
              className={`h-7 w-7 rounded-full border-green-400 flex items-center justify-center ${productInBasket.variant.color?.colorName === item?.colorName ? "border-[1.5px]" : "border-none"}`}
              key={item?.colorCode}
              onClick={() => handleColorSelect(item)}
            >
              <div
                style={{ background: item!.colorCode! }}
                className="h-5 w-5 rounded-full border-[1px] border-slate-300 hover:cursor-pointer hover:opacity-70"
              ></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SetColor;
