"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  PRODUCTS_BY_CATEGORY_QUERY_PAGINATEDResult,
  PRODUCTS_BY_CATEGORY_QUERYResult,
} from "@/sanity.types";
import { TbArrowBadgeRight } from "react-icons/tb";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductGrid from "../products/ProductGrid";

const PRODUCTS_PER_PAGE = 8;

export default function CategoryProductsPage({
  categorySlug,
}: {
  categorySlug: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const [products, setProducts] =
    useState<PRODUCTS_BY_CATEGORY_QUERYResult | null>(null);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE);

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch(
        `/api/products-by-category?category=${categorySlug}&page=${page}&limit=${PRODUCTS_PER_PAGE}`
      );

      const { items, total }: PRODUCTS_BY_CATEGORY_QUERY_PAGINATEDResult =
        await res.json();
      setProducts(items);
      setTotal(total);
    }

    fetchProducts();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [categorySlug, page]);

  const goToPage = (pageNumber: number) => {
    router.push(`?page=${pageNumber}`);
  };

  useEffect(() => {
    if (page > totalPages || page <= 0) {
      goToPage(1);
    }
  }, [page]);

  console.log("productsByCategory: ", products);
  console.log("total: ", total);

  return (
    <div className="w-full p-4 flex flex-col gap-6">
      {products && products.length > 0 && (
        <div className="w-full flex flex-col gap-2">
          <h2 className="text-2xl font-bold flex items-center">
            <TbArrowBadgeRight />
            {products[0].category?.title}
          </h2>
          <ProductGrid products={products} />
        </div>
      )}

      {/* Pagination UI */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              {page > 1 && <PaginationPrevious href={`?page=${page - 1}`} />}
            </PaginationItem>

            {/* Simple logic: show first 3 pages, current page, last page */}
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
                      href={`?page=${pageNumber}`}
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

            <PaginationItem>
              {page < totalPages && (
                <PaginationNext href={`?page=${page + 1}`} />
              )}
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
