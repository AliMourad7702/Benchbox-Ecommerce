"use client";

import React from "react";
import {
  ProductInBasketType,
  SelectedColorType,
  SelectedImageType,
} from "./ProductDetails";
import { PRODUCT_BY_SLUG_QUERYResult } from "@/sanity.types";
import Image from "next/image";

interface ProductImageProps {
  productInBasket: ProductInBasketType;
  selectedImage: SelectedImageType;
  handleImageSelect: (index: number) => void;
}

const ProductImage: React.FC<ProductImageProps> = ({
  productInBasket,
  selectedImage,
  handleImageSelect,
}) => {
  return (
    <div className="relative grid grid-cols-6 h-full min-h-[300px] sm:min-h-[400px]">
      {/* FIXME fix the behavior of the side images when there is 7 or more to display*/}
      <div
        className={`flex flex-col items-center justify-center gap-4 cursor-pointer border-r h-full bg-white  ${productInBasket.variant.color?.images?.length! >= 7 && "max-h-full overflow-y-auto"}`}
      >
        {productInBasket.variant.color?.images?.map((imageUrl, index) => {
          return (
            <div
              key={index}
              onClick={() => handleImageSelect(index)}
              className={`relative w-[80%] aspect-square rounded border-green-400 ${imageUrl === selectedImage.url ? "border-[1.5px] " : "hover:border-[1.2px] hover:border-slate-400"} ${productInBasket.variant.color?.images?.length! >= 7 && index === 0 && "mt-[20rem] sm:mt-[22rem] md:mt-[14rem] lg:mt-[20rem] xl:mt-[22rem]"}`}
            >
              <Image
                src={imageUrl!}
                alt={productInBasket.productName ?? "product image"}
                fill
                className="object-contain"
              />
            </div>
          );
        })}
      </div>
      <div className="col-span-5 relative aspect-square bg-white border-none shadow-none align-content overflow-hidden flex items-center justify-center w-full h-full">
        <Image
          src={selectedImage.url!}
          alt={`Product: ${productInBasket.baseSku} - ${productInBasket.variant.label} ${productInBasket.variant.color?.colorName} image-${selectedImage.index}`}
          fill
          className="object-contain w-full h-full transition-transform duration-300 hover:scale-102 outline-none border-none"
        />
        {productInBasket.variant.color?.stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black opacity-50">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductImage;
