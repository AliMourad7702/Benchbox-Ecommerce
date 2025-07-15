// app/search/page.tsx
import ProductGrid from "@/components/products/ProductGrid";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { searchProductsPaginated } from "@/sanity/lib/products/searchProductsPaginated";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const PRODUCTS_PER_PAGE = 8;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: {
    query: string;
    page?: string;
  };
}) {
  const query = searchParams.query;
  const page = Math.max(1, Number(searchParams.page) || 1);

  if (!query || query.trim().length === 0) {
    return redirect("/");
  }

  const { products, total } = await searchProductsPaginated(
    query.trim(),
    page,
    PRODUCTS_PER_PAGE
  );

  const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE);

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

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="mt-6">
            <PaginationContent>
              {page > 1 && (
                <PaginationItem>
                  <PaginationPrevious
                    href={`/search?query=${query}&page=${page - 1}`}
                  />
                </PaginationItem>
              )}

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNumber = i + 1;
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= page - 1 && pageNumber <= page + 1)
                ) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href={`/search?query=${query}&page=${pageNumber}`}
                        isActive={pageNumber === page}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                } else if (pageNumber === page - 2 || pageNumber === page + 2) {
                  return (
                    <PaginationItem key={`ellipsis-${pageNumber}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                return null;
              })}

              {page < totalPages && (
                <PaginationItem>
                  <PaginationNext
                    href={`/search?query=${query}&page=${page + 1}`}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
