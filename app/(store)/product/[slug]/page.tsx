import ProductDetails, {
  SelectedColorType,
} from "@/components/products/ProductDetails";
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
    color?: string;
  };
}

export const dynamic = "force-static";

// cache revalidation after 30 minutes
export const revalidate = 1800;

async function ProductPage({ params, searchParams }: ProductPageProps) {
  const { slug } = await params;
  const { variant, color } = await searchParams;
  const variantLabel = variant;

  const product = await getProductBySlug(slug);

  if (!product) return notFound();

  let initialVariant: AdjustedVariantType | undefined = product.variants![0];
  let initialColor: SelectedColorType | undefined =
    initialVariant.colorOptions![0];

  if (variantLabel) {
    const foundVariant = product.variants!.find(
      (v) => v.label === variantLabel
    );
    initialVariant = foundVariant;
  }

  if (color) {
    const foundColor = initialVariant!.colorOptions!.find(
      (c) => c.colorName === color
    );
    initialColor = foundColor;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetails
        product={product}
        selectedVariant={initialVariant}
        SelectedColor={initialColor}
      />
    </div>
  );
}

export default ProductPage;
