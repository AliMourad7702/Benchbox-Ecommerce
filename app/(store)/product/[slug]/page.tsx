import ProductDetails from "@/components/ProductDetails";
import { getProductBySlug } from "@/sanity/lib/products/getProductBySlug";
import { isProductOutOfStock } from "@/utils/isProductOutOfStock";
import { PortableText } from "next-sanity";
import Image from "next/image";
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
      <ProductDetails product={product} />
    </div>
  );
}

export default ProductPage;
