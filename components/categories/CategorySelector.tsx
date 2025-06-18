import { ALL_CATEGORIES_QUERYResult, Category } from "@/sanity.types";
import React from "react";

interface CategorySelectorProps {
  // Define the props for the CategorySelector component
  categories: Category[] | ALL_CATEGORIES_QUERYResult;
}

const CategorySelector = ({ categories }: CategorySelectorProps) => {
  return <div>Category Selector Component</div>;
};

export default CategorySelector;
