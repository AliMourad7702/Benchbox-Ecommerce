import CategoryPageWrapper from "@/components/categories/CategoryPageWrapper";
import CategoryProductsPage from "@/components/categories/CategoryProductsPage";
import React from "react";

interface CategoryPageProps {
  params: { slug: string };
}

export const dynamic = "force-static";
export const revalidate = 1800;

async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  return (
    <div>
      <CategoryPageWrapper>
        <CategoryProductsPage categorySlug={slug} />
      </CategoryPageWrapper>
    </div>
  );
}

export default CategoryPage;
