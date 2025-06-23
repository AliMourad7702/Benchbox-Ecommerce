import ProductsView from "@/components/products/ProductsView";
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
      <div>
        <div className="flex flex-col items-center min-h-screen  p-4">
          <ProductsView
            products={products}
            categories={categories}
          />
        </div>
      </div>
    </div>
  );
}
