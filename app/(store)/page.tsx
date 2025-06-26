import CategoriesProductsSection from "@/components/products/CategoriesProductsSection";
import { getAllCategories } from "@/sanity/lib/categories/getAllCategories";
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";
import { getProductsByCategory } from "@/sanity/lib/products/getProductsByCategory";

export default async function Home() {
  const categories = await getAllCategories();
  const meshCategory = categories.find(
    (category) => category.slug === "mesh-fabric-chairs"
  );
  const MeshChairs = await getProductsByCategory("mesh-fabric-chairs");

  // console.log(
  //   crypto.randomUUID().slice(0, 5) +
  //     `>>> Rendered the home page cash with ${products.length} products and ${categories.length} categories`
  // );

  return (
    <div>
      <div>
        <div className="flex flex-col items-center min-h-screen p-4">
          <CategoriesProductsSection
            products={MeshChairs}
            category={meshCategory!}
          />
        </div>
      </div>
    </div>
  );
}
