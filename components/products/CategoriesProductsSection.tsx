import {
  ALL_CATEGORIES_QUERYResult,
  ALL_PRODUCTS_QUERYResult,
} from "@/sanity.types";
import CategoryFlowingMenu from "../categories/CategoryFlowingMenu";
import ProductGrid from "./ProductGrid";
import Link from "next/link";
import { MdArrowForward } from "react-icons/md";

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

      <CategoryFlowingMenu category={category} />

      {/* products here */}
      <div className="flex-1">
        <div>
          <ProductGrid products={products} />

          {/* <hr className="w-1/2 sm:w-3/4 my-6" /> */}
        </div>
      </div>
      <div className="flex justify-center">
        <Link
          href={`/category/${category.slug}`}
          className="bg-black text-white px-4 py-2 rounded-md mt-4 hover:opacity-70 flex items-center justify-center gap-1"
        >
          View All
          <MdArrowForward />
        </Link>
      </div>
    </div>
  );
};

export default CategoriesProductsSection;
