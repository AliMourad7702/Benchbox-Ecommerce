"use client";

import { BasketContextProvider } from "@/hooks/useBasket";
import React from "react";

interface BasketProviderProps {
  children: React.ReactNode;
}

const BasketProvider: React.FC<BasketProviderProps> = ({ children }) => {
  return <BasketContextProvider>{children}</BasketContextProvider>;
};

export default BasketProvider;
