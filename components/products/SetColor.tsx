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
      <span className="text-sm">COLOR:</span>
      <div></div>
    </div>
  );
};

export default SetColor;
