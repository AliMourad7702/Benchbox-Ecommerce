import CategoryPageWrapper from "@/components/categories/CategoryPageWrapper";
import CategoryProductsPage from "@/components/categories/CategoryProductsPage";
import React from "react";

interface CategoryPageProps {
  params: { slug: string };
}

export const dynamic = "force-static";
export const revalidate = 1800;

import { Metadata } from "next";
import { getCategoryBySlug } from "@/sanity/lib/categories/getCategoryBySlug";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Office Furniture Category | BenchBox",
      description:
        "Discover premium office furniture categories including desks, chairs, and workstations. BenchBox Saudi Arabia.",
    };
  }

  const title = `${category.title} | BenchBox Saudi Arabia`;
  const description = `Explore top-quality ${category.title?.toLowerCase()} for your office. Shop online with BenchBox across Saudi Arabia.`;

  const image = category.imageUrl;

  return {
    title,
    description,
    keywords: [
      category.title!,
      "office furniture",
      "desks",
      "chairs",
      "workstations",
      "ergonomic furniture",
      "Saudi Arabia",
      "BenchBox",
    ],
    openGraph: {
      title,
      description,
      url: `https://benchbox.sa/category/${params.slug}`,
      siteName: "BenchBox",
      locale: "en_SA",
      type: "website",
      images: [
        {
          url: image!,
          width: 1200,
          height: 630,
          alt: `${category.title} - BenchBox`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image!],
    },
  };
}

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
