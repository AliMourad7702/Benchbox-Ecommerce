import ProductDetails from "@/components/products/ProductDetails";
import { getProductBySlug } from "@/sanity/lib/products/getProductBySlug";
import { isProductOutOfStock } from "@/utils/isProductOutOfStock";
import { notFound } from "next/navigation";

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
