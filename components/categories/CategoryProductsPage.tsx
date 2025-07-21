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
import Filter from "../layout/Filter";

const PRODUCTS_PER_PAGE = 8;

// TODO add Filter component and logic

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

  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<{
    min: number | string | undefined;
    max: number | string | undefined;
  }>({
    min: undefined,
    max: undefined,
  });

  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | undefined>("");

  const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE);

  useEffect(() => {
    async function loadColors() {
      const res = await fetch(`/api/colors?category=${categorySlug}`);
      const colorData = await res.json();
      console.log("colorData: ", colorData);
      setAvailableColors(colorData);
    }
    loadColors();
  }, [categorySlug]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const params = new URLSearchParams({
          category: categorySlug,
          page: String(page),
          limit: String(PRODUCTS_PER_PAGE),
          ...(selectedColor &&
            selectedColor !== "" && {
              color: selectedColor,
            }),
          ...(searchTerm && { searchTerm }),
          ...(priceRange.min !== "" &&
            !Number.isNaN(priceRange.min) && {
              minPrice: String(priceRange.min),
            }),
          ...(priceRange.max !== "" &&
            !Number.isNaN(priceRange.max) && {
              maxPrice: String(priceRange.max),
            }),
        });
        const res = await fetch(`/api/products-by-category?${params}`);

        const { items, total }: PRODUCTS_BY_CATEGORY_QUERY_PAGINATEDResult =
          await res.json();

        console.log("Fetched filtered products by category: ", items);
        setProducts(items);
        setTotal(total);
      } catch (error) {
        console.error("Error fetching quotations:");
      }
    }

    fetchProducts();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [
    categorySlug,
    page,
    selectedColor,
    searchTerm,
    priceRange.min,
    priceRange.max,
  ]);

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

  if (products!.length === 0) {
    return (
      <div className="flex flex-col items-center text-center px-4 py-8">
        <div className="text-xl text-slate-700">
          No products match your current filters.
        </div>
        <button
          onClick={() => {
            setSearchTerm("");
            setSelectedColor("");
            setPriceRange({ min: undefined, max: undefined });
            router.push("?page=1");
          }}
          className="mt-3 px-4 py-2 text-sm bg-slate-200 text-slate-800 rounded hover:bg-slate-300"
        >
          Reset filters
        </button>
      </div>
    );
  }

  return (
    <div className="w-full p-4 flex flex-col gap-6">
      {products && products.length > 0 && (
        <div className="w-full flex flex-col gap-2">
          <h2 className="text-2xl font-bold flex items-center">
            <TbArrowBadgeRight />
            {products[0].category?.title}
          </h2>
          <div className="px-10">
            <Filter
              colorOptions={availableColors}
              selectedColor={selectedColor}
              onColorChange={setSelectedColor}
              enablePriceFilter
              minPrice={Number(priceRange.min)}
              maxPrice={Number(priceRange.max)}
              onPriceChange={setPriceRange}
              enableSearch
              searchFieldName="base sku, name and specifications"
              onSearchChange={setSearchTerm}
            />
          </div>

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
