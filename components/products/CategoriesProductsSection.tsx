import {
  ALL_CATEGORIES_QUERYResult,
  ALL_PRODUCTS_QUERYResult,
  Category,
} from "@/sanity.types";
import React from "react";
import ProductGrid from "./ProductGrid";
import CategorySelector from "../categories/CategorySelector";

interface ProductsViewProps {
  products: ALL_PRODUCTS_QUERYResult;
  category: ALL_CATEGORIES_QUERYResult[0];
}

const CategoriesProductsSection = ({
  products,
  category,
}: ProductsViewProps) => {
  return (
    <div className="flex flex-col w-full">
      {/* category here */}

      <CategorySelector category={category} />

      {/* products here */}
      <div className="flex-1">
        <div>
          <ProductGrid products={products} />

          {/* <hr className="w-1/2 sm:w-3/4 my-6" /> */}
        </div>
      </div>
    </div>
  );
};

export default CategoriesProductsSection;
