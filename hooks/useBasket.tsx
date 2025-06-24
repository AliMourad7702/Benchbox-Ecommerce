import { ProductInBasketType } from "@/components/products/ProductDetails";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-hot-toast";

type BasketContextType = {
  basketTotalQuantity: number;
  productsInBasket: ProductInBasketType[] | null;
  handleAddProductToBasket: (product: ProductInBasketType) => void;
  handleRemoveProductFromBasket: (product: ProductInBasketType) => void;
  handleQuantityChange: (
    action?: "increase" | "decrease",
    product?: ProductInBasketType,
    value?: number
  ) => void;
  handleClearBasket: () => void;
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

  useEffect(() => {
    setProductsInBasket(JSON.parse(localStorage.getItem("basketProducts")!));
    setBasketTotalQuantity(
      JSON.parse(localStorage.getItem("basketTotalQuantity")!)
    );
  }, []);

  useEffect(() => {
    const totalQty = productsInBasket
      ? productsInBasket.reduce((acc, item) => acc + item.quantity, 0)
      : 0;

    setBasketTotalQuantity(totalQty);
    localStorage.setItem("basketTotalQuantity", JSON.stringify(totalQty));
  }, [productsInBasket]);

  const handleAddProductToBasket = useCallback(
    (product: ProductInBasketType) => {
      setProductsInBasket((prev) => {
        const currentBasket = prev ?? [];

        const existingProductIndex = currentBasket.findIndex(
          (item) =>
            item.variant._id === product.variant._id &&
            item.variant.color?.colorCode === product.variant.color?.colorCode
        );

        let updatedBasket;

        if (existingProductIndex !== -1) {
          updatedBasket = [...currentBasket];
          updatedBasket[existingProductIndex] = {
            ...updatedBasket[existingProductIndex],
            quantity:
              updatedBasket[existingProductIndex].quantity + product.quantity,
          };
        } else {
          updatedBasket = [...currentBasket, product];
        }

        localStorage.setItem("basketProducts", JSON.stringify(updatedBasket));
        return updatedBasket;
      });

      toast.success("Product added to basket!");
    },
    []
  );

  const handleRemoveProductFromBasket = useCallback(
    (product: ProductInBasketType) => {
      setProductsInBasket((prev) => {
        const updatedBasket = (prev ?? []).filter((item) => {
          return !(
            item.variant._id === product.variant._id &&
            item.variant.color?.colorCode === product.variant.color?.colorCode
          );
        });
        localStorage.setItem("basketProducts", JSON.stringify(updatedBasket));
        return updatedBasket;
      });

      toast.success("Product removed from basket !");
    },
    []
  );

  const handleQuantityChange = useCallback(
    (
      action?: "increase" | "decrease",
      product?: ProductInBasketType,
      value?: number
    ) => {
      if (!product) return;

      setProductsInBasket((prev) => {
        const currentBasket = prev ?? [];
        const updatedCart = [...currentBasket];

        const productIndex = updatedCart.findIndex(
          (item) =>
            item.variant._id === product.variant._id &&
            item.variant.color?.colorCode === product.variant.color?.colorCode
        );

        if (productIndex === -1) return currentBasket;

        const prevQty = updatedCart[productIndex].quantity;

        let newQty: number;
        if (value !== undefined) {
          newQty = Math.max(0, value); // Prevent negatives
        } else {
          newQty =
            action === "increase"
              ? prevQty + 1
              : action === "decrease"
                ? prevQty - 1
                : prevQty;
        }

        // Remove item if quantity drops to 0
        if (newQty <= 0) {
          const filtered = updatedCart.filter((_, i) => i !== productIndex);
          localStorage.setItem("basketProducts", JSON.stringify(filtered));
          return filtered;
        }

        // Update quantity
        updatedCart[productIndex] = {
          ...updatedCart[productIndex],
          quantity: newQty,
        };

        localStorage.setItem("basketProducts", JSON.stringify(updatedCart));
        return updatedCart;
      });
    },
    []
  );

  const handleClearBasket = useCallback(() => {
    setProductsInBasket([]);
    setBasketTotalQuantity(0);
    localStorage.setItem("basketProducts", "[]");
    localStorage.setItem("basketTotalQuantity", "0");
  }, []);

  const value = {
    basketTotalQuantity,
    productsInBasket,
    handleAddProductToBasket,
    handleRemoveProductFromBasket,
    handleQuantityChange,
    handleClearBasket,
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
