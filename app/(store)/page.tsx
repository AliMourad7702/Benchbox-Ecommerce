import { Button } from "@/components/ui/button";
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";

export default async function Home() {
  const products = await getAllProducts();

  // console.log(
  //   crypto.randomUUID().slice(0, 5) +
  //     `>>> Rendered the home page cash with ${products.length} products and ${categories.length} categories`
  // );

  return (
    <div>
      <h1>Hello World!</h1>

      {/* TODO render all the products */}
      <div>
        {products.map((product) => {
          return (
            <div key={product._id}>
              <h2>{product.name}</h2>
            </div>
          );
        })}
      </div>
    </div>
  );
}
