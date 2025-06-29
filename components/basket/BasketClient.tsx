"use client";

import { useBasket } from "@/hooks/useBasket";
import Link from "next/link";
import React, { useState } from "react";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import { Button } from "../ui/button";
import BasketProductContent from "./BasketProductContent";
import QuotationForm from "../quotation/QuotationForm";

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
    <div>
      <h2
        className="
        text-2xl
        font-bold
        text-slate-800
        text-center
      "
      >
        Basket Products
      </h2>

      <div className="grid grid-cols-6 text-xs gap-4 pb-2 items-center mt-8">
        <div className="col-span-2 justify-self-start">PRODUCT</div>
        <div className="justify-self-center">VARIANT</div>
        <div className="justify-self-center">PRICE</div>
        <div className="justify-self-center">QUANTITY</div>
        <div className="justify-self-end">TOTAL</div>
      </div>
      <div>
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
      <div className="flex justify-between border-t-[1px] border-slate-200 px-2 py-4">
        <div className="w-[90px]">
          <Button
            onClick={handleClearBasket}
            variant={"outline"}
            size={"sm"}
          >
            Clear Basket
          </Button>
        </div>
        <div className="text-sm flex flex-col gap-1 items-start">
          <div className="flex justify-between w-full items-center font-semibold text-base">
            <span>Subtotal</span>
            <span>SAR {basketTotalPrice.toFixed(2)}</span>
          </div>

          {/* TODO adjust this the way Wassim asked you */}
          <p className="text-slate-500">
            Taxes and shipping calculated after quotation request
          </p>

          <QuotationForm
            dialogTriggerContent="Request Quotation"
            dialogTitle="Quotation Request"
            dialogDescription="Please fill out the form below to request a quotation for your products."
          />

          <Link
            href={"/"}
            className="text-slate-500 flex items-center gap-1 hover:text-slate-800"
          >
            <MdArrowBack />
            <span>Continue Browsing</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BasketClient;
