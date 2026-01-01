import { create } from "zustand";

interface Cart {
  id: string;
  number: number;
}

interface CartProps {
  cart: Cart[];
  addProductToCart: (id: string, num: number) => void;
  removeProductFromCart: (productId: string) => void;
}

const cartStore = create<CartProps>((set) => ({
  cart: [],
  addProductToCart: (id, num) =>
    set((state) => {
      const exists = state.cart.some((item) => item.id === id);

      return {
        cart: exists
          ? state.cart.map((item) =>
              item.id === id ? { ...item, number: item.number + num } : item
            )
          : [...state.cart, { id, number: num }],
      };
    }),

  removeProductFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((product) => product.id !== productId),
    })),
}));

export default cartStore;
