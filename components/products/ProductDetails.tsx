"use client";

import { PRODUCT_BY_SLUG_QUERYResult } from "@/sanity.types";
import { AdjustedVariantType } from "@/utils/isProductOutOfStock";
import { PortableText } from "next-sanity";
import Link from "next/link";
import React, { useCallback, useState } from "react";
import { Button } from "../ui/button";
import ProductImage from "./ProductImage";
import SetColor from "./SetColor";
import SetQuantity from "./SetQuantity";
import SetVariant from "./SetVariant";
import { useBasket } from "@/hooks/useBasket";
import toast from "react-hot-toast";
import RelatedProductsSection from "./RelatedProductsSection";

interface ProductDetailsProps {
  product: PRODUCT_BY_SLUG_QUERYResult;
  selectedVariant?: AdjustedVariantType;
  SelectedColor?: SelectedColorType;
}

export type ProductInBasketType = {
  productId: string;
  baseSku: string;
  productSlug: string;
  productName?: string | null;
  variant: {
    _id: string;
    label: string | null;
    sku: string | null;
    color: SelectedColorType;
  };
  quantity: number;
};

export type SelectedColorType = {
  colorName: string | null;
  colorCode: string | null;
  images: Array<string | null> | null;
  price: number | null;
  stock: number | null;
  specs: Array<{
    children?: Array<{
      marks?: Array<string>;
      text?: string;
      _type: "span";
      _key: string;
    }>;
    style?: "blockquote" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "normal";
    listItem?: "bullet" | "number";
    markDefs?: Array<{
      href?: string;
      _type: "link";
      _key: string;
    }>;
    level?: number;
    _type: "block";
    _key: string;
  }> | null;
} | null;

export type SelectedImageType = {
  index: number;
  url: string | null;
};

const Horizontal = () => {
  return <hr className="w-[30%] my-2" />;
};

const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  selectedVariant,
  SelectedColor,
}: ProductDetailsProps) => {
  const { basketTotalQuantity, productsInBasket, handleAddProductToBasket } =
    useBasket();

  console.log("basketTotalQuantity: ", basketTotalQuantity);
  console.log("productsInBasket: ", productsInBasket);

  const [productInBasket, setProductInBasket] = useState<ProductInBasketType>({
    productId: product!._id,
    baseSku: product!.baseSku!,
    productSlug: product!.slug!,
    productName: product!.name,
    variant: {
      _id: selectedVariant!._id,
      label: selectedVariant!.label,
      sku: selectedVariant!.sku,

      color: {
        colorName:
          SelectedColor?.colorName ||
          selectedVariant!.colorOptions![0].colorName,
        colorCode:
          SelectedColor?.colorCode ||
          selectedVariant!.colorOptions![0].colorCode,
        images:
          SelectedColor?.images || selectedVariant!.colorOptions![0].images,
        price: SelectedColor?.price || selectedVariant!.colorOptions![0].price,
        stock: SelectedColor?.stock || selectedVariant!.colorOptions![0].stock,
        specs: SelectedColor?.specs || selectedVariant!.colorOptions![0].specs,
      },
    },
    quantity: 1,
  });

  const [selectedImage, setSelectedImage] = useState<SelectedImageType>({
    index: 0,
    url:
      SelectedColor?.images![0] ||
      selectedVariant!.colorOptions![0].images![0]!,
  });

  console.log("Product In Basket: ", productInBasket);

  const handleImageSelect = useCallback(
    (index: number) => {
      setSelectedImage((prev) => {
        return {
          ...prev,
          index: index,
          url: productInBasket.variant.color?.images![index]!,
        };
      });
    },
    [productInBasket]
  );

  const handleVariantChange = useCallback((variant: AdjustedVariantType) => {
    setProductInBasket((prev) => {
      return {
        ...prev,
        variant: {
          ...prev.variant,
          _id: variant._id,
          label: variant.label,
          sku: variant.sku,

          color: {
            colorName: variant.colorOptions![0].colorName,
            colorCode: variant.colorOptions![0].colorCode,
            images: variant.colorOptions![0].images,
            price: variant.colorOptions![0].price,
            stock: variant.colorOptions![0].stock,
            specs: variant.colorOptions![0].specs,
          },
        },

        quantity:
          prev.quantity > variant.colorOptions![0].stock! ? 1 : prev.quantity,
      };
    });
    setSelectedImage({ index: 0, url: variant.colorOptions![0].images![0] });
  }, []);

  const handleColorSelect = useCallback((color: SelectedColorType) => {
    setProductInBasket((prev) => {
      return {
        ...prev,
        variant: {
          ...prev.variant,
          color: color,
        },
        quantity: prev.quantity > color?.stock! ? 1 : prev.quantity,
      };
    });
    setSelectedImage((prev) => {
      return {
        ...prev,
        url: color?.images![prev.index] ?? color?.images![0]!,
      };
    });
  }, []);

  const handleQuantityChange = useCallback(
    (
      action?: "increase" | "decrease",
      product?: ProductInBasketType,
      value?: number
    ) => {
      const isManual = value !== undefined;

      if (
        (isManual && value! <= 0) ||
        (action === "decrease" && productInBasket.quantity <= 1)
      ) {
        toast.error("Minimum Quantity is 1");
        return;
      }

      setProductInBasket((prev) => {
        // Manual input (overrides action)
        if (isManual) {
          return {
            ...prev,
            quantity: value!,
          };
        }

        // Action-based update
        if (action === "increase") {
          return {
            ...prev,
            quantity: prev.quantity + 1,
          };
        }

        if (action === "decrease") {
          return {
            ...prev,
            quantity: prev.quantity - 1,
          };
        }

        return prev; // fallback
      });
    },
    [productInBasket.quantity]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div
        className={`relative w-full aspect-square overflow-hidden rounded-lg shadow-lg bg-white`}
      >
        {productInBasket!.variant.color!.images?.length! > 0 && (
          <ProductImage
            productInBasket={productInBasket}
            selectedImage={selectedImage}
            handleImageSelect={handleImageSelect}
          />
        )}
      </div>
      <div className="flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-4">
            {product!.name
              ? product!.name
              : product!.baseSku + " " + productInBasket.variant!.label}
          </h1>
          <div className="text-xl font-semibold mb-4">
            SR {productInBasket.variant.color?.price?.toFixed(2)}
          </div>
          <Horizontal />
          <div className="prose max-w-none mb-6 text-black">
            {Array.isArray(productInBasket.variant.color?.specs) && (
              <PortableText value={productInBasket.variant.color?.specs} />
            )}
          </div>
          <Horizontal />
          <div className="flex flex-col gap-2">
            <div className="flex text-sm">
              <Link
                href={`/category/${product!.category!.slug}`}
                className="hover:opacity-50 flex gap-2"
              >
                <span className="font-semibold">Category:</span>{" "}
                <span>{product!.category!.title}</span>
              </Link>
            </div>
            <div className="flex text-sm gap-2">
              <span className="font-semibold">SKU / Model Number:</span>{" "}
              {product!.baseSku}
            </div>
            <div className="flex text-sm gap-2">
              <span className="font-semibold">Availability:</span>{" "}
              <span
                className={
                  productInBasket!.variant!.color!.stock === 0
                    ? "text-red-400"
                    : "text-green-400"
                }
              >
                {productInBasket!.variant!.color!.stock === 0
                  ? "Out of Stock"
                  : "In Stock"}
              </span>
            </div>
          </div>

          <Horizontal />
          <div className="text-sm">
            <SetVariant
              variants={product?.variants!}
              productInBasket={productInBasket}
              handleVariantChange={handleVariantChange}
            />
          </div>
          <Horizontal />
          <SetColor
            productInBasket={productInBasket}
            colors={
              product!.variants?.find(
                (v) => v._id == productInBasket.variant._id
              )?.colorOptions ?? []
            }
            handleColorSelect={handleColorSelect}
          />
          <Horizontal />
          <div className="text-sm">
            <SetQuantity
              productInBasket={productInBasket}
              handleQuantityChange={handleQuantityChange}
            />
          </div>
          <Horizontal />
          <Button
            className="bg-blue-500 hover:bg-blue-700 hover:opacity-50 w-full max-w-[60%] sm:max-w-[30%]"
            size={"lg"}
            onClick={() => handleAddProductToBasket(productInBasket)}
          >
            Add to Basket
          </Button>
          {/* TODO add a "Continue Shopping" button next to the "Add to Basket" one */}
        </div>
      </div>
      <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
        <RelatedProductsSection
          product={productInBasket}
          categorySlug={product?.category?.slug!}
        />
      </div>
    </div>
  );
};

export default ProductDetails;
