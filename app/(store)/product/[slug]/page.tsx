import { getProductBySlug } from "@/sanity/lib/products/getProductBySlug";
import { isProductOutOfStock } from "@/utils/isProductOutOfStock";
import { notFound } from "next/navigation";
import React from "react";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) return notFound();

  const isOutOfStock = isProductOutOfStock(product);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          className={`relative aspect-square overflow-hidden rounded-lg shadow-lg ${isOutOfStock ? "opacity-50" : ""}`}
        >
          {/* FIXME think about the logic to implement how to showcase each variant and switch between them (and simultaneously switch the necessary info*/}
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
