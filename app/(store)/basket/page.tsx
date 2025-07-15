import BasketClient from "@/components/basket/BasketClient";
import React from "react";

export const dynamic = "force-dynamic";

const Basket = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <BasketClient />
    </div>
  );
};

export default Basket;
