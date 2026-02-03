import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartProduct {
  id: string;
  number: number;
}

interface OrderProduct {
  id: string;
  quantity: number;
  deliveryDate: string;
}

interface Order {
  orderId: string;
  orderDate: string;
  totalCents: number;
  products: OrderProduct[];
}

interface CartProps {
  cart: CartProduct[];
  orders: Order[];
  addProductToCart: (id: string, num: number) => void;
  removeProductFromCart: (productId: string) => void;
  updateProductQuantity: (productId: string, num: number) => void;
  placeOrder: (totalCents: number, products: OrderProduct[]) => void;
  clearCart: () => void;
}

const cartStore = create<CartProps>()(
  persist(
    (set) => ({
      cart: [],
      orders: [],
      addProductToCart: (id, num) =>
        set((state) => {
          const exists = state.cart.some((item) => item.id === id);

          return {
            cart: exists
              ? state.cart.map((item) =>
                  item.id === id
                    ? { ...item, number: item.number + num }
                    : item,
                )
              : [...state.cart, { id, number: num }],
          };
        }),

      removeProductFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((product) => product.id !== productId),
        })),

      updateProductQuantity: (productId, num) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === productId ? { ...item, number: num } : item,
          ),
        })),

      placeOrder: (totalCents, products) =>
        set((state) => ({
          orders: [
            {
              orderId: crypto.randomUUID(),
              orderDate: new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
              }),
              totalCents,
              products,
            },
            ...state.orders,
          ],
        })),

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "amazon-cart-storage",
    },
  ),
);

export default cartStore;
