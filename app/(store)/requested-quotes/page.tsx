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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import Link from "next/link";
import Image from "next/image";
import { GET_QUOTATIONS_BY_CLERK_IDResult } from "@/sanity.types";

const QUOTATIONS_PER_PAGE = 4;

export default function RequestedQuotesPage() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const [quotations, setQuotations] =
    useState<GET_QUOTATIONS_BY_CLERK_IDResult>([]);
  const [total, setTotal] = useState(0);
  const totalPages = Math.ceil(total / QUOTATIONS_PER_PAGE);

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
        const res = await fetch(
          `/api/quotations-by-clerkId?clerkId=${user.id}&page=${page}&limit=${QUOTATIONS_PER_PAGE}`
        );

        const { items, total } = await res.json();
        setQuotations(items);
        setTotal(total);
      } catch (err) {
        console.error("Error fetching quotations:", err);
      }
    };

    fetchQuotations();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [user?.id, page]);

  if (!user) return null;

  if (!quotations || quotations.length === 0) {
    return (
      <div className="flex flex-col items-center text-center px-4 py-8">
        <div className="text-2xl">You haven't requested any quotations</div>
        <div>
          <Link
            href={"/"}
            className="text-slate-500 flex items-center gap-1 mt-2 hover:text-slate-800"
          >
            <MdArrowBack />
            <span>Browse products</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-8">
      <div className="bg-white p-5 sm:p-8 rounded-xl shadow-lg w-full max-w-4xl">
        <h2 className="text-3xl text-slate-800 font-bold tracking-tight mb-8">
          My Quotations
        </h2>

        <div className="flex flex-col gap-2">
          {quotations.map((quotation, index) => (
            <div
              key={quotation._id}
              className="text-slate-500 border border-slate-200 p-5 sm:p-7 shadow-sm overflow-hidden"
            >
              <div className="p-4 sm:p-6 border-b border-slate-200">
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1 font-bold">
                      Quotation Number
                    </p>
                    <p className="font-mono text-sm text-green-600 break-all">
                      {quotation._id}
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-sm text-slate-500 mb-1">
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
                        "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {quotation.status}
                    </span>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-sm text-slate-500 mb-1">Total Amount</p>
                    <p className="font-bold text-lg">
                      SAR {quotation.totalPrice?.toFixed(2)}
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
                      className="text-sm font-semibold text-slate-500 mb-3 sm:mb-4"
                    >
                      Items Requested
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 sm:space-y-1">
                        {quotation.items?.map((item, i) => (
                          <Link
                            key={i}
                            href={{
                              pathname: `/product/${item.productSlug}`,
                              query: { variant: item.variantLabel },
                            }}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-2 border-b last:border-b-0"
                          >
                            <div className="flex items-center gap-3 sm:gap-4">
                              {item.color?.firstImage && (
                                <div className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-md overflow-hidden">
                                  <Image
                                    src={item.color?.firstImage}
                                    alt={`item ${i}`}
                                    className="object-cover"
                                    fill
                                  />
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-sm sm:text-base text-slate-800">
                                  {item.variantSku}
                                </p>
                                <p className="text-sm text-slate-500">
                                  {item.color?.colorName}
                                </p>
                                <p className="text-sm text-slate-500">
                                  Quantity: {item.quantity ?? "N/A"}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col justify-center gap-1">
                              <p className="text-sm font-medium text-right sm:text-base text-slate-500">
                                Item price: SAR{" "}
                                {item.color?.variantPrice?.toFixed(2)}
                              </p>
                              <p className="text-sm font-medium text-right sm:text-base text-slate-700">
                                Subtotal: SAR{" "}
                                {(
                                  item.color?.variantPrice! * item.quantity!
                                ).toFixed(2)}
                              </p>
                            </div>
                          </Link>
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
