"use client";

import cartStore from "@/store/cartStore";
import { Roboto } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import products from "@/data/products";
import { useRouter } from "next/navigation";

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

const page = () => {
  const { cart, removeProductFromCart } = cartStore();
  const router = useRouter();
  const cartProduct = cart.map((item) => ({
    ...products.find((p) => p.id === item.id)!,
    number: item.number,
  }));

  let number = 0;
  cart.forEach((cartItem) => {
    number += cartItem.number;
  });
  return (
    <div className={`font-roboto ${roboto.className}`}>
      <div className="h-[60px] px-[30px] bg-white flex justify-center fixed top-0 left-0 right-0 z-1000">
        <div className="w-full max-w-[1100px] flex items-center justify-between">
          <div className="w-[150px] max-[575px]:w-auto">
            <Link href={"/"}>
              <Image
                width={100}
                height={100}
                alt="image"
                className="w-[95px] mt-[8px] object-contain max-[575px]:hidden"
                src="/images/amazon-logo.png"
              />

              <img
                className="hidden max-[575px]:inline-block max-[575px]:h-[35px] max-[575px]:mt-[5px]"
                src="/images/amazon-mobile-logo.png"
              />
            </Link>
          </div>

          <div className="flex-1 shrink-0 text-center text-[25px] font-medium flex justify-center max-[1000px]:text-[20px] max-[1000px]:mr-[60px] max-[575px]:mr-[5px]">
            Checkout (
            <a
              className="text-[#007185] text-[23px] no-underline cursor-pointer max-[1000px]:text-[18px]"
              href="amazon.html"
            >
              {number} items
            </a>
            )
          </div>

          <div className="text-right w-[150px] flex justify-end max-[1000px]:w-auto">
            <img src="/images/icons/checkout-lock-icon.png" />
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mt-[130px] px-[30px] md:px-0 mb-[100px] mx-auto max-[1000px]:max-w-[500px]">
        <div className="font-bold text-[22px] mb-[18px]">Review your order</div>

        <div className="grid grid-cols-[1fr_350px] gap-x-[12px] items-start max-[1000px]:grid-cols-1">
          <div className="order-summary">
            {number === 0 ? (
              <div className="flex flex-col gap-2">
                <p> Your cart is empty </p>
                <button
                  className="bg-[#ffd814] cursor-pointer rounded-lg  w-fit shadow-md hover:opacity-90 px-3 py-2"
                  onClick={() => router.push("/")}
                >
                  View products
                </button>
              </div>
            ) : (
              cartProduct.map((product) => (
                <div
                  key={product.id}
                  className="border border-[#dedede] rounded-[4px] p-[18px] mb-[12px]"
                >
                  <div className="text-[#007600] font-bold text-[19px] mt-[5px] mb-[22px]">
                    Delivery date: Tuesday, June 21
                  </div>

                  <div className="grid grid-cols-[100px_1fr_1fr] gap-x-[25px] max-[1000px]:grid-cols-[100px_1fr] max-[1000px]:gap-y-[30px]">
                    <img
                      className="max-w-full max-h-[120px] mx-auto"
                      src={`/${product.image}`}
                    />

                    <div className="cart-item-details">
                      <div className="font-bold mb-[8px]">{product.name}</div>
                      <div className="text-[#b12704] font-bold mb-[5px]">
                        ${(product.priceCents / 100).toFixed(2)}
                      </div>
                      <div className="product-quantity">
                        <span>
                          Quantity:{" "}
                          <span className="quantity-label">
                            {product.number}
                          </span>
                        </span>
                        <span className="ml-[3px] text-[#017cb6] cursor-pointer hover:text-[#c45000]">
                          Update
                        </span>
                        <span
                          className="ml-[3px] text-[#017cb6] cursor-pointer hover:text-[#c45000]"
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
                      <div className="grid grid-cols-[24px_1fr] mb-[12px] cursor-pointer">
                        <input
                          type="radio"
                          className="ml-0 cursor-pointer mr-[5px]"
                          name="delivery-option-1"
                        />
                        <div>
                          <div className="text-[#007600] font-medium mb-[3px]">
                            Tuesday, June 21
                          </div>
                          <div className="text-[#787878] text-[15px]">
                            FREE Shipping
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-[24px_1fr] mb-[12px] cursor-pointer">
                        <input
                          type="radio"
                          className="ml-0 cursor-pointer mr-[5px]"
                          name="delivery-option-1"
                        />
                        <div>
                          <div className="text-[#007600] font-medium mb-[3px]">
                            Wednesday, June 15
                          </div>
                          <div className="text-[#787878] text-[15px]">
                            $4.99 - Shipping
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-[24px_1fr] mb-[12px] cursor-pointer">
                        <input
                          type="radio"
                          className="ml-0 mr-[5px] cursor-pointer"
                          name="delivery-option-1"
                        />
                        <div>
                          <div className="text-[#007600] font-medium mb-[3px]">
                            Monday, June 13
                          </div>
                          <div className="text-[#787878] text-[15px]">
                            $9.99 - Shipping
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border border-[#dedede] rounded-[4px] p-[18px] pb-[5px] max-[1000px]:row-start-1 max-[1000px]:mb-[12px]">
            <div className="font-bold text-[18px] mb-[12px]">Order Summary</div>

            <div className="grid grid-cols-[1fr_auto] text-[15px] mb-[9px]">
              <div>Items (3):</div>
              <div className="text-right">$42.75</div>
            </div>

            <div className="grid grid-cols-[1fr_auto] text-[15px] mb-[9px]">
              <div>Shipping &amp; handling:</div>
              <div className="text-right">$4.99</div>
            </div>

            <div className="grid grid-cols-[1fr_auto] text-[15px] mb-[9px]">
              <div className="pt-[9px]">Total before tax:</div>
              <div className="text-right border-t border-[#dedede] pt-[9px]">
                $47.74
              </div>
            </div>

            <div className="grid grid-cols-[1fr_auto] text-[15px] mb-[9px]">
              <div>Estimated tax (10%):</div>
              <div className="text-right">$4.77</div>
            </div>

            <div className="grid grid-cols-[1fr_auto] text-[#b12704] font-bold text-[18px] border-t border-[#dedede] pt-[18px] mb-[9px]">
              <div>Order total:</div>
              <div className="text-right">$52.51</div>
            </div>

            <button className="w-full py-[8px] rounded-[8px] mt-[11px] mb-[15px] bg-[#ffd814] border border-[#fcbf00] cursor-pointer hover:bg-[#f7ca00] hover:border-[#f2c200] active:bg-[#ffd814] active:border-[#fcd200] active:shadow-none shadow-[0_2px_5px_rgba(213,217,217,0.5)] transition-all text-sm">
              Place your order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
