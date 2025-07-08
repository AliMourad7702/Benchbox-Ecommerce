import { GET_QUOTATIONS_BY_CLERK_IDResult } from "@/sanity.types";
import { getQuotationsByClerkId } from "@/sanity/lib/quotations/getQuotationsByClerkId";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { MdArrowBack } from "react-icons/md";

// TODO finish this page

const RequestedQuotesPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const quotations: GET_QUOTATIONS_BY_CLERK_IDResult =
    await getQuotationsByClerkId(userId);

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
          {quotations.length > 0 &&
            quotations.map((quotation, index) => {
              console.log(
                "Quotation no.",
                index,
                " created at:",
                quotation.createdAt
              );
              return (
                <div
                  key={index}
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
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                }
                              )
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center p-2">
                    <div className="flex items-center">
                      <span className="text-sm mr-2">Status:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${quotation.status === "accepted" && "bg-green-100 text-green-800"}
                        ${quotation.status === "under reviewing" && "bg-yellow-100 text-yellow-800"}
                        ${quotation.status === "declined" && "bg-red-100 text-red-800"}
                        ${quotation.status === "received" && "bg-slate-100 text-slate-800"}`}
                      >
                        {quotation.status}
                      </span>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-sm text-slate-500 mb-1">
                        Total Amount
                      </p>
                      <p className="font-bold text-lg">
                        SAR {quotation.totalPrice?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default RequestedQuotesPage;
