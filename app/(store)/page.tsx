import CategoriesProductsSection from "@/components/products/CategoriesProductsSection";
import { getFeaturedCategories } from "@/sanity/lib/categories/getFeaturedCategories";
import { getProductsByCategory } from "@/sanity/lib/products/getProductsByCategory";

// TODO remove all console logs

export const dynamic = "force-static";
export const revalidate = 120;

export default async function Home() {
  const featuredCategories = await getFeaturedCategories();

  const categoryWithProducts = await Promise.all(
    featuredCategories.map(async (category) => {
      const products = await getProductsByCategory(category.slug!);
      return {
        category: { ...category },
        products,
      };
    })
  );

  // console.log(
  //   crypto.randomUUID().slice(0, 5) +
  //     `>>> Rendered the home page cash with ${products.length} products and ${categories.length} categories`
  // );

  return (
    <div>
      <div>
        <div className="flex flex-col items-center min-h-screen p-4 gap-9">
          {categoryWithProducts.map(({ category, products }) => (
            <CategoriesProductsSection
              key={category.slug}
              products={products}
              category={category}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
