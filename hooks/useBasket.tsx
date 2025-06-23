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
    action: "increase" | "decrease",
    product?: ProductInBasketType
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

      setBasketTotalQuantity((prev) => {
        const updatedQuantity = prev + product.quantity;
        localStorage.setItem(
          "basketTotalQuantity",
          JSON.stringify(updatedQuantity)
        );
        return updatedQuantity;
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

      setBasketTotalQuantity((prev) => {
        const newTotalQuantity = prev - product.quantity;
        localStorage.setItem(
          "basketTotalQuantity",
          JSON.stringify(newTotalQuantity)
        );
        return newTotalQuantity;
      });

      toast.success("Product removed from basket !");
    },
    []
  );

  const handleQuantityChange = useCallback(
    (action: "increase" | "decrease", product?: ProductInBasketType) => {
      if (
        product!.quantity === product?.variant.color?.stock &&
        action === "increase"
      ) {
        toast.error("Maximum Quantity for this item reached!");
        return;
      }
      setProductsInBasket((prev) => {
        const currentBasket = prev ?? [];

        // Case: remove item if quantity is 1 and action is decrease
        if (product!.quantity === 1 && action === "decrease") {
          const updatedCart = currentBasket.filter(
            (item) =>
              !(
                item.variant._id === product!.variant._id &&
                item.variant.color?.colorCode ===
                  product!.variant.color?.colorCode
              )
          );

          localStorage.setItem("basketProducts", JSON.stringify(updatedCart));
          return updatedCart;
        }

        // Else: adjust quantity
        const updatedCart = [...currentBasket];
        const productIndex = updatedCart.findIndex(
          (item) =>
            item.variant._id === product!.variant._id &&
            item.variant.color?.colorCode === product!.variant.color?.colorCode
        );

        if (productIndex !== -1) {
          const newQuantity =
            action === "increase"
              ? updatedCart[productIndex].quantity + 1
              : updatedCart[productIndex].quantity - 1;

          updatedCart[productIndex] = {
            ...updatedCart[productIndex],
            quantity: newQuantity,
          };
        }

        localStorage.setItem("basketProducts", JSON.stringify(updatedCart));
        return updatedCart;
      });
      setBasketTotalQuantity((prevQty) => {
        const newQty = action === "increase" ? prevQty + 1 : prevQty - 1;
        localStorage.setItem("basketTotalQuantity", JSON.stringify(newQty));
        return newQty;
      });
    },
    []
  );

  const handleClearBasket = useCallback(() => {
    setProductsInBasket([]);
    setBasketTotalQuantity(0);
    localStorage.removeItem("basketProducts");
    localStorage.removeItem("basketTotalQuantity");
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
