import React, { useEffect, useState } from "react";
import { ProductInBasketType } from "./ProductDetails";
import { ALL_PRODUCTS_QUERYResult } from "@/sanity.types";
import { getRelatedProductsByFilter } from "@/sanity/lib/products/getRelatedProductsByFilter";
import ProductGrid from "./ProductGrid";
import { MdArrowForward } from "react-icons/md";

// TODO add a related products by package (search for products with different categories and showcase them as related ones and adjust backend)

interface RelatedProductsSectionProps {
  product: ProductInBasketType;
  categorySlug: string;
}

const RelatedProductsSection: React.FC<RelatedProductsSectionProps> = ({
  product,
  categorySlug,
}) => {
  const [filterOption, setFilterOption] = useState<"category" | "color">(
    "category"
  );
  const [relatedFilteredProducts, setRelatedFilteredProducts] =
    useState<ALL_PRODUCTS_QUERYResult | null>(null);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      const res = await fetch("/api/related-products-by-filter", {
        method: "POST",
        body: JSON.stringify({
          baseSku: product.baseSku,
          categorySlug,
          colorName: product.variant.color?.colorName!,
          filterOption,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const related = await res.json();
      setRelatedFilteredProducts(related);
    };

    fetchRelatedProducts();
  }, [filterOption, product]);

  console.log("relatedFilteredProducts: ", relatedFilteredProducts);

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-4 text-xl font-bold">
        <MdArrowForward />
        <h2>Related Products by </h2>
        <select
          id="categories"
          value={filterOption}
          onChange={(e) => {
            setFilterOption(e.target.value as "category" | "color");
          }}
          className="hover:cursor-pointer border border-slate-600 rounded-sm p-1 pb-1"
        >
          <option value="category">Category</option>
          <option value="color">Color</option>
        </select>
      </div>
      {relatedFilteredProducts && relatedFilteredProducts.length > 0 ? (
        <div>
          <div className="bg-white p-8 rounded-lg shadow-md w-full h-full">
            <ProductGrid products={relatedFilteredProducts!} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col i justify-top bg-gray-100 p-4">
          <div className="bg-white p-8 rounded-lg shadow-md w-full">
            <h1 className="text-l font-bold mb-6 text-center">
              No Products with same {filterOption} found
            </h1>
            <p className="text-gray-600 text-center">
              Try filtering with something else.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RelatedProductsSection;
