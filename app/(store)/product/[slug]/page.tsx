import ProductDetails, {
  SelectedColorType,
} from "@/components/products/ProductDetails";
import { getProductBySlug } from "@/sanity/lib/products/getProductBySlug";
import {
  AdjustedVariantType,
  isProductOutOfStock,
} from "@/utils/isProductOutOfStock";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    variant?: string;
    color?: string;
  };
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);

  if (!product) return { title: "Product Not Found" };

  const title = product.name
    ? `${product.name} | BenchBox`
    : `${product.baseSku} | BenchBox`;

  const description =
    product
      .variants![0].colorOptions![0].specs!.filter(
        (block) => block._type === "block"
      )
      .map((block) => block.children?.map((child) => child.text).join(" "))
      .join(" ") || "Explore premium office products from BenchBox.";

  const image = product.variants?.[0]?.colorOptions?.[0]?.images?.[0];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image!,
          width: 1200,
          height: 630,
          alt: product.name! || product.baseSku!,
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

async function ProductPage({ params, searchParams }: ProductPageProps) {
  const { slug } = await params;
  const { variant, color } = await searchParams;

  console.log("searchParams: ", searchParams);

  const product = await getProductBySlug(slug);

  if (!product) return notFound();

  let initialVariant: AdjustedVariantType | undefined = product.variants![0];
  let initialColor: SelectedColorType | undefined =
    initialVariant.colorOptions![0];

  if (variant) {
    const foundVariant = product.variants!.find(
      (v) => v.label === decodeURIComponent(variant)
    );
    initialVariant = foundVariant;
  }

  if (color) {
    const foundColor = initialVariant!.colorOptions!.find(
      (c) => c.colorName === decodeURIComponent(color)
    );
    initialColor = foundColor;
  }

  console.log("encoded variant: ", variant);
  console.log("encoded color: ", color);

  console.log("decoded variant: ", decodeURIComponent(variant!));
  console.log("decoded color: ", decodeURIComponent(color!));

  console.log("Initial Variant: ", initialVariant);
  console.log("Initial Color: ", initialColor);

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
