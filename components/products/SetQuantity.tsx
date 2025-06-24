"use client";

import React from "react";
import { ProductInBasketType } from "./ProductDetails";
import { Button } from "../ui/button";

interface SetQuantityProps {
  productInBasket: ProductInBasketType;
  isBasket?: boolean;
  handleQuantityChange: (
    action?: "increase" | "decrease",
    product?: ProductInBasketType,
    value?: number
  ) => void;
  disabled?: boolean;
}

const buttonStyles =
  "border-[1.2px]! border-slate-300! hover:cursor-pointer! hover:opacity-70! rounded! w-10! h-10! bg-slate-200!";

const SetQuantity: React.FC<SetQuantityProps> = ({
  productInBasket,
  isBasket = false,
  handleQuantityChange,
  disabled = false,
}) => {
  return (
    <div className="flex gap-8 items-center text-sm">
      {!isBasket && <span className="font-semibold">QUANTITY: </span>}
      <div className="flex items-center gap-4">
        <Button
          variant={"outline"}
          onClick={() => handleQuantityChange("decrease", productInBasket)}
          className={buttonStyles}
          disabled={disabled}
        >
          -
        </Button>
        <input
          type="number"
          value={productInBasket.quantity}
          className="w-12 h-10 text-center border-[1.2px] border-slate-300 rounded"
          onChange={(e) => {
            const val = e.target.value;

            if (val === "") {
              // User cleared input — immediately reset to 1 (minimum)
              handleQuantityChange(undefined, productInBasket, 1);
            } else {
              // Parse the number and keep min = 1
              const newValue = Math.max(1, Number(val));
              handleQuantityChange(undefined, productInBasket, newValue);
            }
          }}
          onFocus={(e) => e.target.select()} // optional: auto-select content on focus for easier replacement
        />

        <Button
          variant={"outline"}
          onClick={() => handleQuantityChange("increase", productInBasket)}
          className={buttonStyles}
          disabled={disabled}
        >
          +
        </Button>
      </div>
    </div>
  );
};

export default SetQuantity;
