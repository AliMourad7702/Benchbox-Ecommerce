import CategoryProductsPage from "@/components/categories/CategoryProductsPage";
import React from "react";

interface CategoryPageProps {
  params: { slug: string };
}

async function CategoryPage({ params }: CategoryPageProps) {
  // TODO finish category page
  // TODO add pagination

  const { slug } = await params;
  return (
    <div>
      <CategoryProductsPage categorySlug={slug} />
    </div>
  );
}

export default CategoryPage;
