"use client";

import Filter from "@/components/layout/Filter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { GET_QUOTATIONS_BY_CLERK_IDResult } from "@/sanity.types";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MdArrowBack } from "react-icons/md";

const QUOTATIONS_PER_PAGE = 4;
const STATUS_OPTIONS = ["received", "under reviewing", "accepted", "declined"];

export default function RequestedQuotesPage() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const [quotations, setQuotations] =
    useState<GET_QUOTATIONS_BY_CLERK_IDResult>([]);

  const [total, setTotal] = useState(0);
  const totalPages = Math.ceil(total / QUOTATIONS_PER_PAGE);

  const [searchTerm, setSearchTerm] = useState("");
  const [statuses, setStatuses] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{
    min: number | string | undefined;
    max: number | string | undefined;
  }>({
    min: undefined,
    max: undefined,
  });

  const [hasAnyQuotations, setHasAnyQuotations] = useState<boolean | null>(
    null
  );

  const goToPage = (pageNumber: number) => {
    router.push(`?page=${pageNumber}`);
  };

  useEffect(() => {
    if (page > totalPages || page <= 0) {
      goToPage(1);
    }
  }, [page, totalPages]);

  useEffect(() => {
    if (!user?.id) return;

    const fetchQuotations = async () => {
      try {
        const params = new URLSearchParams({
          clerkId: user.id,
          page: String(page),
          limit: String(QUOTATIONS_PER_PAGE),
          ...(searchTerm && { searchTerm }),
          ...(statuses.length > 0 && { status: statuses.join(",") }),
          ...(priceRange.min !== "" &&
            !Number.isNaN(priceRange.min) && {
              minPrice: String(priceRange.min),
            }),
          ...(priceRange.max !== "" &&
            !Number.isNaN(priceRange.max) && {
              maxPrice: String(priceRange.max),
            }),
        });

        console.log("params: ", String(params));
        const res = await fetch(`/api/quotations-by-clerkId?${params}`);

        const { items, total } = await res.json();
        setQuotations(items);
        setTotal(total);
      } catch (err) {
        console.error("Error fetching quotations:", err);
      }
    };

    fetchQuotations();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [user?.id, page, statuses, priceRange, searchTerm]);

  useEffect(() => {
    router.push("?page=1");
  }, [statuses, priceRange, searchTerm]);

  useEffect(() => {
    if (!user?.id) return;

    const checkIfAnyQuotationsExist = async () => {
      try {
        const res = await fetch(
          `/api/quotations-by-clerkId?clerkId=${user.id}&limit=1`
        );
        const { total } = await res.json();
        setHasAnyQuotations(total > 0);
      } catch (err) {
        console.error("Error checking if quotations exist:", err);
      }
    };

    checkIfAnyQuotationsExist();
  }, [user?.id]);

  if (!user) return null;

  if (!hasAnyQuotations) {
    return (
      <div className="flex flex-col items-center text-center px-4 py-8">
        <div className="text-2xl">You haven't requested any quotations</div>
        <div>
          <Link
            href={"/"}
            className="text-slate-600 flex items-center gap-1 mt-2 hover:text-slate-800"
          >
            <MdArrowBack />
            <span>Browse products</span>
          </Link>
        </div>
      </div>
    );
  }

  if (quotations.length === 0 && hasAnyQuotations) {
    return (
      <div className="flex flex-col items-center text-center px-4 py-8">
        <div className="text-xl text-slate-700">
          No quotations match your current filters.
        </div>
        <button
          onClick={() => {
            setSearchTerm("");
            setStatuses([]);
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
    <div className="flex flex-col items-center justify-start min-h-screen p-8">
      <div className="flex-1 bg-white p-5 sm:p-8 rounded-xl shadow-lg w-full max-w-4xl">
        <h2 className="text-3xl text-slate-900 font-bold tracking-tight mb-2">
          My Quotations
        </h2>

        <Filter
          statusOptions={STATUS_OPTIONS}
          selectedStatuses={statuses}
          onStatusChange={setStatuses}
          enablePriceFilter
          minPrice={Number(priceRange.min)}
          maxPrice={Number(priceRange.max)}
          onPriceChange={setPriceRange}
          enableSearch
          searchFieldName="id"
          onSearchChange={setSearchTerm}
        />
        <div className="flex flex-col gap-2 mt-6">
          {quotations.map((quotation) => (
            <div
              key={quotation._id}
              className="text-slate-600 border border-slate-200 p-5 sm:p-7 shadow-sm overflow-hidden"
            >
              <div className="p-4 sm:p-6 border-b border-slate-200">
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-4">
                  <div>
                    <p className="text-sm text-slate-600 mb-1 font-bold">
                      Quotation Number
                    </p>
                    <p className="font-mono text-sm text-green-600 break-all">
                      {quotation._id}
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-sm text-slate-600 mb-1">
                      Submission Date
                    </p>
                    <p className="font-medium">
                      {quotation.createdAt
                        ? new Date(quotation.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                  <div className="flex items-center">
                    <span className="text-sm mr-2">Status:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        quotation.status === "accepted" &&
                        "bg-green-100 text-green-800"
                      } ${
                        quotation.status === "under reviewing" &&
                        "bg-yellow-100 text-yellow-800"
                      } ${
                        quotation.status === "declined" &&
                        "bg-red-100 text-red-800"
                      } ${
                        quotation.status === "received" &&
                        "bg-slate-100 text-slate-900"
                      }`}
                    >
                      {quotation.status}
                    </span>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-sm text-slate-600 mb-1">Total Amount</p>
                    <p className="font-bold text-lg">
                      SR {quotation.totalPrice?.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 sm:px-6 sm:py-4">
                <Accordion
                  type="single"
                  collapsible
                >
                  <AccordionItem value="items">
                    <AccordionTrigger
                      isDark
                      className="text-sm font-semibold text-slate-600 mb-3 sm:mb-4"
                    >
                      Items Requested
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 sm:space-y-1">
                        {quotation.items?.map((item, i) => (
                          <div
                            key={i}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-2 border-b last:border-b-0"
                          >
                            <div className="flex items-center justify-between sm:gap-4 w-full">
                              <div className="flex gap-2 w-fit">
                                {item.color?.firstImage && (
                                  <Link
                                    href={{
                                      pathname: `/product/${item.productSlug}`,
                                      query: {
                                        variant: item.variantLabel,
                                        color: item.color?.colorName,
                                      },
                                    }}
                                    className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-md overflow-hidden"
                                  >
                                    <Image
                                      src={item.color?.firstImage}
                                      alt={`item ${i}`}
                                      className="object-cover"
                                      fill
                                    />
                                  </Link>
                                )}
                                <Link
                                  href={{
                                    pathname: `/product/${item.productSlug}`,
                                    query: {
                                      variant: item.variantLabel,
                                      color: item.color?.colorName,
                                    },
                                  }}
                                >
                                  <p className="font-medium text-sm sm:text-base text-slate-900">
                                    {item.variantSku}
                                  </p>
                                  <p className="text-sm text-slate-600">
                                    {item.color?.colorName}
                                  </p>
                                  <p className="text-sm text-slate-600">
                                    Quantity: {item.quantity ?? "N/A"}
                                  </p>
                                </Link>
                              </div>

                              <Link
                                href={`/categories/${item.category?.slug?.current}`}
                                className="text-sm text-slate-600 flex flex-col justify-center hover:text-slate-800"
                              >
                                {item.category?.title}
                              </Link>
                            </div>

                            <div className="flex flex-col justify-center gap-1 w-full">
                              <p className="text-sm font-medium text-right sm:text-base text-slate-600">
                                Item price: SR{" "}
                                {item.color?.variantPrice?.toFixed(2)}
                              </p>
                              <p className="text-sm font-medium text-right sm:text-base text-slate-700">
                                Subtotal: SR{" "}
                                {(
                                  item.color?.variantPrice! * item.quantity!
                                ).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="mt-6">
            <PaginationContent>
              {page > 1 && (
                <PaginationItem>
                  <PaginationPrevious href={`?page=${page - 1}`} />
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

              {page < totalPages && (
                <PaginationItem>
                  <PaginationNext href={`?page=${page + 1}`} />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
