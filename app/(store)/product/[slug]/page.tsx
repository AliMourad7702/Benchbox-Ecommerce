import ProductDetails from "@/components/products/ProductDetails";
import { getProductBySlug } from "@/sanity/lib/products/getProductBySlug";
import {
  AdjustedVariantType,
  isProductOutOfStock,
} from "@/utils/isProductOutOfStock";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: {
    variant?: string;
  };
}

async function ProductPage({ params, searchParams }: ProductPageProps) {
  const { slug } = await params;
  const { variant } = await searchParams;
  const variantLabel = variant;

  const product = await getProductBySlug(slug);

  if (!product) return notFound();

  let initialVariant: AdjustedVariantType | undefined = product.variants![0];

  if (variantLabel) {
    const foundVariant = product.variants!.find(
      (v) => v.label === variantLabel
    );
    initialVariant = foundVariant;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetails
        product={product}
        selectedVariant={initialVariant}
      />
    </div>
  );
}

export default ProductPage;
