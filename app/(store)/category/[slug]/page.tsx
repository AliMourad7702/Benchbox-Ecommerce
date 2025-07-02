import CategoryProductsPage from "@/components/categories/CategoryProductsPage";
import React from "react";

interface CategoryPageProps {
  params: { slug: string };
}

async function CategoryPage({ params }: CategoryPageProps) {
  // TODO test pagination after adding products

  const { slug } = await params;
  return (
    <div>
      <CategoryProductsPage categorySlug={slug} />
    </div>
  );
}

export default CategoryPage;
