import ProductsView from "@/components/ProductsView";
import { Button } from "@/components/ui/button";
import { getAllCategories } from "@/sanity/lib/categories/getAllCategories";
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";

export default async function Home() {
  const products = await getAllProducts();
  const categories = await getAllCategories();

  // console.log(
  //   crypto.randomUUID().slice(0, 5) +
  //     `>>> Rendered the home page cash with ${products.length} products and ${categories.length} categories`
  // );

  return (
    <div>
      {/* TODO render all the products */}
      <div>
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
          <ProductsView
            products={products}
            categories={categories}
          />
        </div>
      </div>
    </div>
  );
}
