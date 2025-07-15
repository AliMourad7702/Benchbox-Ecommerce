import CategoriesProductsSection from "@/components/products/CategoriesProductsSection";
import { ALL_CATEGORIES_QUERYResult, Category } from "@/sanity.types";
import { getAllCategories } from "@/sanity/lib/categories/getAllCategories";
import { getProductsByCategory } from "@/sanity/lib/products/getProductsByCategory";

// TODO remove all console logs

export const dynamic = "force-static";
export const revalidate = 120;

interface CategoriesObject {
  "mesh-fabric-chairs": ALL_CATEGORIES_QUERYResult[0];
  "leather-chairs": ALL_CATEGORIES_QUERYResult[0];
}

export default async function Home() {
  const categories = await getAllCategories();
  const categoriesObject: CategoriesObject = {
    "mesh-fabric-chairs": categories.find(
      (category) => category.slug === "mesh-fabric-chairs"
    )!,
    "leather-chairs": categories.find(
      (category) => category.slug === "leather-chairs"
    )!,
  };
  const meshChairs = await getProductsByCategory(
    categoriesObject["mesh-fabric-chairs"].slug!
  );

  const leatherChairs = await getProductsByCategory(
    categoriesObject["leather-chairs"].slug!
  );

  // console.log(
  //   crypto.randomUUID().slice(0, 5) +
  //     `>>> Rendered the home page cash with ${products.length} products and ${categories.length} categories`
  // );

  return (
    <div>
      <div>
        <div className="flex flex-col items-center min-h-screen p-4 gap-9">
          <CategoriesProductsSection
            products={meshChairs}
            category={categoriesObject["mesh-fabric-chairs"]}
          />
          <CategoriesProductsSection
            products={leatherChairs}
            category={categoriesObject["leather-chairs"]}
          />
        </div>
      </div>
    </div>
  );
}
