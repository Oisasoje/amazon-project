"use client";

import cartStore from "@/store/cartStore";
import { Roboto } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import products from "@/data/products";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const DELIVERY_OPTIONS = [
  { id: 1, deliveryDays: 7, priceCents: 0 },
  { id: 2, deliveryDays: 3, priceCents: 499 },
  { id: 3, deliveryDays: 1, priceCents: 699 },
];

const Page = () => {
  const {
    cart,
    removeProductFromCart,
    updateProductQuantity,
    placeOrder,
    clearCart,
  } = cartStore();

  const [shippingByProduct, setShippingByProduct] = useState<
    Record<string, number>
  >({});
  const [deliveryDaysByProduct, setDeliveryDaysByProduct] = useState<
    Record<string, number>
  >({});
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [tempQuantity, setTempQuantity] = useState<number>(0);

  const router = useRouter();
  const today = dayjs();

  useEffect(() => {
    setShippingByProduct((prev) => {
      const newState = { ...prev };
      cart.forEach((item) => {
        if (!(item.id in newState)) {
          newState[item.id] = 0;
        }
      });

      Object.keys(newState).forEach((id) => {
        if (!cart.find((item) => item.id === id)) {
          delete newState[id];
        }
      });
      return newState;
    });

    setDeliveryDaysByProduct((prev) => {
      const newState = { ...prev };
      cart.forEach((item) => {
        if (!(item.id in newState)) {
          newState[item.id] = 7;
        }
      });
      Object.keys(newState).forEach((id) => {
        if (!cart.find((item) => item.id === id)) {
          delete newState[id];
        }
      });
      return newState;
    });
  }, [cart]);

  const cartProduct = cart.map((item) => {
    const product = products.find((p) => p.id === item.id);
    return product
      ? { ...product, number: item.number }
      : {
          id: item.id,
          name: "Unknown Product",
          priceCents: 0,
          image: "",
          number: item.number,
        };
  });

  const totalItemsCount = cart.reduce((acc, item) => acc + item.number, 0);

  const itemsPriceInCents = cartProduct.reduce(
    (acc, item) => acc + item.priceCents * item.number,
    0,
  );

  const totalShippingPriceInCents = Object.values(shippingByProduct).reduce(
    (sum, price) => sum + price,
    0,
  );

  const totalBeforeTaxInCents = itemsPriceInCents + totalShippingPriceInCents;
  const estimatedTaxInCents = Math.round(0.1 * totalBeforeTaxInCents);
  const orderTotalInCents = totalBeforeTaxInCents + estimatedTaxInCents;

  const getDeliveryDateString = (days: number) => {
    return today.add(days, "days").format("dddd, MMMM D");
  };

  const handleUpdateClick = (id: string, currentNum: number) => {
    setEditingProductId(id);
    setTempQuantity(currentNum);
  };

  const handleSaveQuantity = (id: string) => {
    if (tempQuantity > 0 && tempQuantity <= 100) {
      updateProductQuantity(id, tempQuantity);
    }
    setEditingProductId(null);
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    router.push("/orders");

    const orderProducts = cart.map((item) => ({
      id: item.id,
      quantity: item.number,
      deliveryDate: getDeliveryDateString(deliveryDaysByProduct[item.id] || 7),
    }));

    placeOrder(orderTotalInCents, orderProducts);
    clearCart();
  };

  return (
    <div
      className={`font-roboto ${roboto.className} min-h-screen bg-[#0f1111] text-white`}
    >
      <div className="h-[60px] px-[30px] bg-[#131921] border-b border-[#232f3e] flex justify-center fixed top-0 left-0 right-0 z-50">
        <div className="w-full max-w-[1100px] flex items-center justify-between">
          <div className="w-[150px] max-[575px]:w-auto">
            <Link href={"/"}>
              <Image
                width={100}
                height={100}
                alt="Amazon logo"
                className="w-[95px] mt-[8px] object-contain max-[575px]:hidden"
                src="/images/amazon-logo-white.png"
              />
              <img
                alt="Amazon mobile logo"
                className="hidden max-[575px]:inline-block max-[575px]:h-[35px] max-[575px]:mt-[5px]"
                src="/images/amazon-mobile-logo-white.png"
              />
            </Link>
          </div>

          <div className="flex-1 shrink-0 text-center text-[25px] font-medium flex justify-center max-[1000px]:text-[20px] max-[1000px]:mr-[60px] max-[575px]:mr-[5px]">
            Checkout (
            <Link
              className="text-[#febd69] text-[23px] no-underline cursor-pointer max-[1000px]:text-[18px] hover:text-[#ff9900]"
              href="/"
            >
              {totalItemsCount} items
            </Link>
            )
          </div>

          <div className="text-right w-[150px] flex justify-end max-[1000px]:w-auto invert">
            <img
              alt="Security icon"
              src="/images/icons/checkout-lock-icon.png"
            />
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mt-[130px] px-[30px] md:px-0 mb-[100px] mx-auto max-[1000px]:max-w-[500px]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-bold text-[22px] mb-[18px]"
        >
          Review your order
        </motion.div>

        <div className="grid grid-cols-[1fr_350px] gap-x-[12px] items-start max-[1000px]:grid-cols-1">
          <div className="order-summary">
            {totalItemsCount === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-4 bg-[#131921] p-8 rounded-lg border border-[#232f3e]"
              >
                <p className="text-xl"> Your cart is empty </p>
                <button
                  className="bg-[#ffd814] text-[#0f1111] font-bold cursor-pointer rounded-full w-fit shadow-md hover:bg-[#fcbf00] px-6 py-2 transition-all"
                  onClick={() => router.push("/")}
                >
                  View products
                </button>
              </motion.div>
            ) : (
              <AnimatePresence>
                {cartProduct.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-[#232f3e] rounded-[4px] p-[18px] mb-[12px] bg-[#131921]"
                  >
                    <div className="text-[#067d62] font-bold text-[19px] mt-[5px] mb-[22px]">
                      Delivery date:{" "}
                      {getDeliveryDateString(
                        deliveryDaysByProduct[product.id] || 7,
                      )}
                    </div>

                    <div className="grid grid-cols-[100px_1fr_1fr] gap-x-[25px] max-[1000px]:grid-cols-[100px_1fr] max-[1000px]:gap-y-[30px]">
                      <div className="bg-white rounded-md p-2">
                        <img
                          alt={product.name}
                          className="max-w-full max-h-[120px] mx-auto object-contain"
                          src={`/${product.image}`}
                        />
                      </div>

                      <div className="cart-item-details">
                        <div className="font-bold mb-[8px] text-[#e5e7eb]">
                          {product.name}
                        </div>
                        <div className="text-[#febd69] font-bold mb-[5px]">
                          ${(product.priceCents / 100).toFixed(2)}
                        </div>
                        <div className="product-quantity flex items-center flex-wrap gap-2 text-sm text-[#9ca3af]">
                          <span>
                            Quantity:{" "}
                            {editingProductId === product.id ? (
                              <input
                                type="number"
                                min="1"
                                max="99"
                                value={tempQuantity}
                                onChange={(e) =>
                                  setTempQuantity(Number(e.target.value))
                                }
                                className="w-[50px] bg-[#232f3e] border border-[#374151] rounded px-1 text-white"
                                autoFocus
                              />
                            ) : (
                              <span className="font-bold text-white">
                                {product.number}
                              </span>
                            )}
                          </span>
                          {editingProductId === product.id ? (
                            <span
                              className="text-[#017cb6] cursor-pointer hover:text-[#ff9900] font-medium"
                              onClick={() => handleSaveQuantity(product.id)}
                            >
                              Save
                            </span>
                          ) : (
                            <span
                              className="text-[#017cb6] cursor-pointer hover:text-[#ff9900] font-medium"
                              onClick={() =>
                                handleUpdateClick(product.id, product.number)
                              }
                            >
                              Update
                            </span>
                          )}
                          <span
                            className="text-[#017cb6] cursor-pointer hover:text-[#ff9900] font-medium"
                            onClick={() => removeProductFromCart(product.id)}
                          >
                            Delete
                          </span>
                        </div>
                      </div>

                      <div className="max-[1000px]:col-span-2">
                        <div className="font-bold mb-[10px] text-sm uppercase tracking-wider text-[#9ca3af]">
                          Choose a delivery option:
                        </div>
                        {DELIVERY_OPTIONS.map((option) => (
                          <label
                            key={option.id}
                            className="grid grid-cols-[24px_1fr] mb-[12px] cursor-pointer group"
                          >
                            <input
                              type="radio"
                              name={`delivery-option-${product.id}`}
                              checked={
                                (deliveryDaysByProduct[product.id] || 7) ===
                                option.deliveryDays
                              }
                              onChange={() => {
                                setShippingByProduct((prev) => ({
                                  ...prev,
                                  [product.id]: option.priceCents,
                                }));
                                setDeliveryDaysByProduct((prev) => ({
                                  ...prev,
                                  [product.id]: option.deliveryDays,
                                }));
                              }}
                              className="mt-1 accent-[#ff9900]"
                            />

                            <div>
                              <div className="text-[#067d62] font-medium mb-[3px] group-hover:text-[#ff9900]">
                                {getDeliveryDateString(option.deliveryDays)}
                              </div>
                              <div className="text-[#9ca3af] text-[15px]">
                                {option.priceCents === 0
                                  ? "FREE Shipping"
                                  : `$${(option.priceCents / 100).toFixed(2)} - Shipping`}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-[#232f3e] rounded-[4px] p-[18px] pb-[5px] bg-[#131921] sticky top-[80px] max-[1000px]:row-start-1 max-[1000px]:static max-[1000px]:mb-[12px]"
          >
            <div className="font-bold text-[18px] mb-[12px]">Order Summary</div>

            <div className="grid grid-cols-[1fr_auto] text-[15px] mb-[9px] text-[#e5e7eb]">
              <div>Items ({totalItemsCount}):</div>
              <div className="text-right">
                $
                {(itemsPriceInCents / 100).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>

            <div className="grid grid-cols-[1fr_auto] text-[15px] mb-[9px] text-[#e5e7eb]">
              <div>Shipping &amp; handling:</div>
              <div className="text-right">
                $
                {(totalShippingPriceInCents / 100).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>

            <div className="grid grid-cols-[1fr_auto] text-[15px] mb-[9px] text-[#e5e7eb]">
              <div className="pt-[9px]">Total before tax:</div>
              <div className="text-right border-t border-[#374151] pt-[9px]">
                $
                {(totalBeforeTaxInCents / 100).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>

            <div className="grid grid-cols-[1fr_auto] text-[15px] mb-[9px] text-[#9ca3af]">
              <div>Estimated tax (10%):</div>
              <div className="text-right">
                $
                {(estimatedTaxInCents / 100).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>

            <div className="grid grid-cols-[1fr_auto] text-[#febd69] font-bold text-[18px] border-t border-[#374151] pt-[18px] mb-[9px]">
              <div>Order total:</div>
              <div className="text-right">
                $
                {(orderTotalInCents / 100).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePlaceOrder}
              disabled={cart.length === 0}
              className="w-full py-[10px] rounded-full mt-[11px] mb-[15px] bg-[#ffd814] text-[#0f1111] font-bold border border-[#fcbf00] cursor-pointer hover:bg-[#fcbf00] transition-all text-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Place your order
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Page;
