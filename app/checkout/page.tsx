"use client";

import cartStore from "@/store/cartStore";
import { Roboto } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import products from "@/data/products";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

interface Product {
  id: string;
  image: string;
  name: string;
  rating: {
    stars: number;
    count: number;
  };
  priceCents: number;
  keywords: string[];
}

interface ShippingPriceArr {
  [key: number]: number;
}

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
    <div className={`font-roboto ${roboto.className}`}>
      <div className="h-[60px] px-[30px] bg-white flex justify-center fixed top-0 left-0 right-0 z-1000">
        <div className="w-full max-w-[1100px] flex items-center justify-between">
          <div className="w-[150px] max-[575px]:w-auto">
            <Link href={"/"}>
              <Image
                width={100}
                height={100}
                alt="Amazon logo"
                className="w-[95px] mt-[8px] object-contain max-[575px]:hidden"
                src="/images/amazon-logo.png"
              />
              <img
                alt="Amazon mobile logo"
                className="hidden max-[575px]:inline-block max-[575px]:h-[35px] max-[575px]:mt-[5px]"
                src="/images/amazon-mobile-logo.png"
              />
            </Link>
          </div>

          <div className="flex-1 shrink-0 text-center text-[25px] font-medium flex justify-center max-[1000px]:text-[20px] max-[1000px]:mr-[60px] max-[575px]:mr-[5px]">
            Checkout (
            <Link
              className="text-[#007185] text-[23px] no-underline cursor-pointer max-[1000px]:text-[18px] hover:text-[#c45000]"
              href="/"
            >
              {totalItemsCount} items
            </Link>
            )
          </div>

          <div className="text-right w-[150px] flex justify-end max-[1000px]:w-auto">
            <img
              alt="Security icon"
              src="/images/icons/checkout-lock-icon.png"
            />
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mt-[130px] px-[30px] md:px-0 mb-[100px] mx-auto max-[1000px]:max-w-[500px]">
        <div className="font-bold text-[22px] mb-[18px]">Review your order</div>

        <div className="grid grid-cols-[1fr_350px] gap-x-[12px] items-start max-[1000px]:grid-cols-1">
          <div className="order-summary">
            {totalItemsCount === 0 ? (
              <div className="flex flex-col gap-2">
                <p> Your cart is empty </p>
                <button
                  className="bg-[#ffd814] cursor-pointer rounded-lg  w-fit shadow-md hover:opacity-90 px-3 py-2 transition-colors"
                  onClick={() => router.push("/")}
                >
                  View products
                </button>
              </div>
            ) : (
              cartProduct.map((product) => (
                <div
                  key={product.id}
                  className="border border-[#dedede] rounded-[4px] p-[18px] mb-[12px] bg-white"
                >
                  <div className="text-[#007600] font-bold text-[19px] mt-[5px] mb-[22px]">
                    Delivery date:{" "}
                    {getDeliveryDateString(
                      deliveryDaysByProduct[product.id] || 7,
                    )}
                  </div>

                  <div className="grid grid-cols-[100px_1fr_1fr] gap-x-[25px] max-[1000px]:grid-cols-[100px_1fr] max-[1000px]:gap-y-[30px]">
                    <img
                      alt={product.name}
                      className="max-w-full max-h-[120px] mx-auto object-contain"
                      src={`/${product.image}`}
                    />

                    <div className="cart-item-details">
                      <div className="font-bold mb-[8px]">{product.name}</div>
                      <div className="text-[#b12704] font-bold mb-[5px]">
                        ${(product.priceCents / 100).toFixed(2)}
                      </div>
                      <div className="product-quantity flex items-center flex-wrap gap-2">
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
                              className="w-[50px] border border-[#d5d9d9] rounded px-1"
                              autoFocus
                            />
                          ) : (
                            <span className="quantity-label">
                              {product.number}
                            </span>
                          )}
                        </span>
                        {editingProductId === product.id ? (
                          <span
                            className="text-[#017cb6] cursor-pointer hover:text-[#c45000] text-sm font-medium"
                            onClick={() => handleSaveQuantity(product.id)}
                          >
                            Save
                          </span>
                        ) : (
                          <span
                            className="text-[#017cb6] cursor-pointer hover:text-[#c45000] text-sm font-medium"
                            onClick={() =>
                              handleUpdateClick(product.id, product.number)
                            }
                          >
                            Update
                          </span>
                        )}
                        <span
                          className="text-[#017cb6] cursor-pointer hover:text-[#c45000] text-sm font-medium"
                          onClick={() => removeProductFromCart(product.id)}
                        >
                          Delete
                        </span>
                      </div>
                    </div>

                    <div className="max-[1000px]:col-span-2">
                      <div className="font-bold mb-[10px]">
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
                            className="mr-2"
                          />

                          <div>
                            <div className="text-[#007600] font-medium mb-[3px] group-hover:text-[#c45000]">
                              {getDeliveryDateString(option.deliveryDays)}
                            </div>
                            <div className="text-[#787878] text-[15px]">
                              {option.priceCents === 0
                                ? "FREE Shipping"
                                : `$${(option.priceCents / 100).toFixed(2)} - Shipping`}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border border-[#dedede] rounded-[4px] p-[18px] pb-[5px] bg-white sticky top-[80px] max-[1000px]:row-start-1 max-[1000px]:static max-[1000px]:mb-[12px]">
            <div className="font-bold text-[18px] mb-[12px]">Order Summary</div>

            <div className="grid grid-cols-[1fr_auto] text-[15px] mb-[9px]">
              <div>Items ({totalItemsCount}):</div>
              <div className="text-right">
                $
                {(itemsPriceInCents / 100).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>

            <div className="grid grid-cols-[1fr_auto] text-[15px] mb-[9px]">
              <div>Shipping &amp; handling:</div>
              <div className="text-right">
                $
                {(totalShippingPriceInCents / 100).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>

            <div className="grid grid-cols-[1fr_auto] text-[15px] mb-[9px]">
              <div className="pt-[9px]">Total before tax:</div>
              <div className="text-right border-t border-[#dedede] pt-[9px]">
                $
                {(totalBeforeTaxInCents / 100).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>

            <div className="grid grid-cols-[1fr_auto] text-[15px] mb-[9px]">
              <div>Estimated tax (10%):</div>
              <div className="text-right">
                $
                {(estimatedTaxInCents / 100).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>

            <div className="grid grid-cols-[1fr_auto] text-[#b12704] font-bold text-[18px] border-t border-[#dedede] pt-[18px] mb-[9px]">
              <div>Order total:</div>
              <div className="text-right">
                $
                {(orderTotalInCents / 100).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={cart.length === 0}
              className="w-full py-[8px] rounded-[8px] mt-[11px] mb-[15px] bg-[#ffd814] border border-[#fcbf00] cursor-pointer hover:bg-[#f7ca00] hover:border-[#f2c200] active:bg-[#ffd814] active:border-[#fcd200] active:shadow-none shadow-[0_2px_5px_rgba(213,217,217,0.5)] transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Place your order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
