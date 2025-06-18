import {
  ALL_CATEGORIES_QUERYResult,
  ALL_PRODUCTS_QUERYResult,
  Category,
  Product,
} from "@/sanity.types";
import React from "react";
import ProductGrid from "./ProductGrid";
import CategorySelector from "../categories/CategorySelector";

interface ProductsViewProps {
  products: ALL_PRODUCTS_QUERYResult;
  categories: ALL_CATEGORIES_QUERYResult;
}

const ProductsView = ({ products, categories }: ProductsViewProps) => {
  return (
    <div className="flex flex-col">
      {/* categories here */}
      <div className="w-full sm:w-[200px]">
        <CategorySelector categories={categories} />
      </div>

      {/* products here */}
      <div className="flex-1">
        <div>
          <ProductGrid products={products} />

          <hr className="w-1/2 sm:w-3/4" />
        </div>
      </div>
    </div>
  );
};

export default ProductsView;
