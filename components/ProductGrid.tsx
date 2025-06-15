"use client";

import { ALL_PRODUCTS_QUERYResult, Product } from "@/sanity.types";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import ProductThumbnail from "./ProductThumbnail";

interface ProductGridProps {
  products: ALL_PRODUCTS_QUERYResult;
}

const ProductGrid = ({ products }: ProductGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4 gap-3">
      {products.map((product) => {
        return (
          <AnimatePresence key={product._id}>
            <motion.div
              layout
              initial={{ opacity: 0.2 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center"
            >
              <ProductThumbnail
                key={product._id}
                product={product}
              />
            </motion.div>
          </AnimatePresence>
        );
      })}
    </div>
  );
};

export default ProductGrid;
