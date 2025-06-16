import ProductGrid from "@/components/ProductGrid";
import { searchProducts } from "@/sanity/lib/products/searchProducts";
import { redirect } from "next/navigation";
import React from "react";

async function SearchPage({
  searchParams,
}: {
  searchParams: {
    query: string;
  };
}) {
  const { query } = await searchParams;
  if (query.length === 0) {
    return redirect("/");
  }

  const products = await searchProducts(query.trim());

  console.log("===================================================");
  console.log("products: ", JSON.stringify(products));
  console.log("===================================================");

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-top min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
          <h1 className="text-2xl font-bold mb-6 text-center">
            No Products Found for: <span className="font-bold">{query}</span>
          </h1>
          <p className="text-gray-600 text-center">
            Try searching for something else.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-top min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-6xl">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Search Results for: <span className="font-bold">{query}</span>
        </h1>
        <ProductGrid products={products} />
      </div>
    </div>
  );
}

export default SearchPage;
