import { ProductInBasketType } from "@/components/products/ProductDetails";
import { createContext, useCallback, useContext, useState } from "react";

type BasketContextType = {
  basketTotalQuantity: number;
  productsInBasket: ProductInBasketType[] | null;
  handleAddProductToBasket: (product: ProductInBasketType) => void;
};

interface BasketContextProviderProps {
  [propName: string]: any;
}

export const BasketContext = createContext<BasketContextType | null>(null);

export const BasketContextProvider = (props: BasketContextProviderProps) => {
  const [basketTotalQuantity, setBasketTotalQuantity] = useState(0);
  const [productsInBasket, setProductsInBasket] = useState<
    ProductInBasketType[] | null
  >(null);

  const handleAddProductToBasket = useCallback(
    (product: ProductInBasketType) => {
      setProductsInBasket((prev) => {
        if (prev && prev.length > 0) {
          let existingProductIndex = prev.findIndex(
            (item) =>
              item.variant._id === product.variant._id &&
              item.variant.color?.colorCode === product.variant.color?.colorCode
          );
          if (existingProductIndex !== -1) {
            const updatedBasket = [...prev];
            updatedBasket[existingProductIndex] = {
              ...updatedBasket[existingProductIndex],
              quantity:
                updatedBasket[existingProductIndex].quantity + product.quantity,
            };
            return updatedBasket;
          }
          return [...prev, product];
        }

        return [product];
      });
      setBasketTotalQuantity((prev) => {
        return prev + product.quantity;
      });
    },
    []
  );

  const value = {
    basketTotalQuantity,
    productsInBasket,
    handleAddProductToBasket,
  };

  return (
    <BasketContext.Provider
      value={value}
      {...props}
    />
  );
};

export const useBasket = () => {
  const context = useContext(BasketContext);

  if (!context) {
    throw new Error(
      "useBasket must be only used within a BasketContextProvider !"
    );
  }

  return context;
};
