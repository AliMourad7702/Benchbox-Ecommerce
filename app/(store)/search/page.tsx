import { searchProducts } from "@/sanity/lib/products/searchProducts";
import React from "react";

async function SearchPage({
  searchParams,
}: {
  searchParams: {
    query: string;
  };
}) {
  const { query } = await searchParams;
  const products = await searchProducts(query);

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
    <div>
      Search Results for: <span className="font-bold">{query}</span>
    </div>
  );
}

export default SearchPage;
