import { create } from "zustand";

interface Cart {
  id: string;
  number: number;
}

interface CartProps {
  cart: Cart[];
  addProductToCart: (id: string) => void;
  removeProductFromCart: (productId: string) => void;
}

const cartStore = create<CartProps>((set) => ({
  cart: [],
  addProductToCart: (id) =>
    set((state) => {
      const matchingProduct = state.cart.find((cartItem) => cartItem.id === id);
      if (matchingProduct)
        return {
          cart: state.cart.map(
            (cartItem): Cart =>
              matchingProduct.id === cartItem.id
                ? { ...cartItem, number: cartItem.number + 1 }
                : cartItem
          ),
        };
      else return { cart: [...state.cart, { id, number: 1 }] };
    }),
  removeProductFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((product) => product.id !== productId),
    })),
}));

export default cartStore;
