"use client";

import React from "react";
import { ProductInBasketType } from "./ProductDetails";
import { Button } from "../ui/button";

interface SetQuantityProps {
  productInBasket: ProductInBasketType;
  quantity: number;
  isBasket?: boolean;
  isOutOfStock?: boolean;
  handleQuantityChange: (action: "increase" | "decrease") => void;
}

const buttonStyles =
  "border-[1.2px]! border-slate-300! hover:cursor-pointer! hover:opacity-70! rounded! w-10! h-10! bg-slate-200!";

const SetQuantity: React.FC<SetQuantityProps> = ({
  productInBasket,
  quantity,
  isBasket = false,
  isOutOfStock = false,
  handleQuantityChange,
}) => {
  return (
    <div className="flex gap-8 items-center text-sm">
      {!isBasket && <span className="font-semibold">QUANTITY: </span>}
      <div className="flex items-center gap-4">
        <Button
          variant={"outline"}
          onClick={() => handleQuantityChange("decrease")}
          className={buttonStyles}
          disabled={isOutOfStock}
        >
          -
        </Button>
        <div>{productInBasket.quantity}</div>
        <Button
          variant={"outline"}
          onClick={() => handleQuantityChange("increase")}
          className={buttonStyles}
          disabled={isOutOfStock}
        >
          +
        </Button>
      </div>
    </div>
  );
};

export default SetQuantity;
