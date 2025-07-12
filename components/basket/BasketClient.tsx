"use client";

import { useBasket } from "@/hooks/useBasket";
import Link from "next/link";
import React, { useState } from "react";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import { Button } from "../ui/button";
import BasketProductContent from "./BasketProductContent";
import QuotationForm from "../quotation/QuotationForm";

// TODO optional - add responsive accordion behavior on mobile screens for each product in basket

const BasketClient = () => {
  const { productsInBasket, handleClearBasket, basketTotalPrice } = useBasket();

  if (!productsInBasket || productsInBasket.length === 0) {
    return (
      <div className="flex flex-col items-center text-center">
        <div className="text-2xl">Your basket is empty</div>
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
    <div className="flex flex-col items-center justify-start min-h-screen p-4">
      <div className="bg-white p-5 sm:p-7 rounded-xl shadow-lg w-full">
        <h2
          className="
        text-3xl
        font-bold
        text-slate-800
        text-center
      "
        >
          Basket Products
        </h2>

        <div className="hidden md:grid grid-cols-6 text-xs gap-4 pb-2 items-center mt-8">
          <div className="col-span-2 justify-self-start">PRODUCT</div>
          <div className="justify-self-center">VARIANT</div>
          <div className="justify-self-center">PRICE</div>
          <div className="justify-self-center">QUANTITY</div>
          <div className="justify-self-end">TOTAL</div>
        </div>
        <div className="flex flex-col gap-4">
          {productsInBasket &&
            productsInBasket.map((product) => {
              return (
                <BasketProductContent
                  key={
                    product.variant._id + " " + product.variant.color?.colorCode
                  }
                  product={product}
                />
              );
            })}
        </div>
        <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-8 border-t-[1px] border-slate-200 px-4 py-4 sticky bottom-0 left-0 right-0 z-10 bg-white ">
          <Button
            onClick={handleClearBasket}
            variant={"outline"}
            size={"sm"}
            className="w-full md:w-auto bg-slate-300!"
          >
            Clear Basket
          </Button>
          <div className="text-sm flex flex-col gap-1 items-start w-full md:w-auto">
            <div className="flex justify-between w-full items-center font-semibold text-base">
              <span>Subtotal</span>
              <span>SR {basketTotalPrice.toFixed(2)}</span>
            </div>

            <p className="text-slate-500 text-xs">
              Taxes and shipping calculated after quotation request
            </p>

            <QuotationForm
              dialogTriggerContent="Request Quotation"
              dialogTitle="Quotation Request"
              dialogDescription="Please fill out the form below to request a quotation for your products."
            />

            <Link
              href={"/"}
              className="text-slate-500 flex items-center gap-1 hover:text-slate-800 text-sm"
            >
              <MdArrowBack />
              <span>Continue Browsing</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasketClient;
