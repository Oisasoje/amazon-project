"use client";

import Image from "next/image";
import Link from "next/link";
import products from "@/data/products";
import { Roboto } from "next/font/google";
import { useRouter } from "next/navigation";
import cartStore from "@/store/cartStore";
import { useState } from "react";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const page = () => {
  const { cart, addProductToCart } = cartStore();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const router = useRouter();

  return (
    <div className={`font-roboto ${roboto.className}`}>
      <div className="mt-[60px]">
        <div className="grid grid-cols-1 min-[450px]:grid-cols-1 min-[451px]:grid-cols-2 min-[576px]:grid-cols-3 min-[801px]:grid-cols-4 min-[1001px]:grid-cols-5 min-[1301px]:grid-cols-6 min-[1601px]:grid-cols-7 min-[2001px]:grid-cols-8">
          {products.map(({ id, image, name, rating, priceCents }) => (
            <div
              key={id}
              className="pt-[40px] pb-[25px] px-[25px] border-r border-b border-[#e7e7e7] flex flex-col"
            >
              <div className="relative h-[180px] w-full mb-5">
                <Image
                  alt="product-image"
                  src={`/${image}`}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="h-[40px] text-[15px] leading-5 line-clamp-2 tracking-wide">
                {name}
              </div>

              <div className="flex items-center mb-[7px]">
                <Image
                  unoptimized
                  width={20}
                  height={20}
                  alt="product-rating"
                  className="w-25 mr-1.5"
                  src={`/images/ratings/rating-${rating.stars * 10}.png`}
                />
                <div className="text-[#017cb6] cursor-pointer mt-0.75 hover:text-[#c45000] ">
                  {rating.count}
                </div>
              </div>

              <div className="font-medium mb-1.75">
                ${(priceCents / 100).toFixed(2)}
              </div>

              <div className="mb-2.5">
                <select
                  className="text-[#212121] bg-[#f0f0f0] focus:outline-2 focus:outline-[#ff9900]  font-[15px] border-[#d5d9d9] cursor-pointer border rounded-2 px-1 py-0.5 "
                  onChange={(e: any) =>
                    setQuantities({ ...quantities, [id]: +e.target.value })
                  }
                  value={quantities[id] || 1}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1"></div>

              <div className="text-[#067d62] text-base flex items-center mb-2 opacity-0">
                <Image
                  width={20}
                  height={20}
                  alt="product-added"
                  src="/images/icons/checkmark.png"
                />
                Added
              </div>

              <button
                className="w-full p-2 bg-[#ffd814] text-[#212121] cursor-pointer border border-[#fcbf00] rounded-full hover:bg-[#fcbf00] hover:text-[#212121] hover:border-[#fcbf00] text-sm shadow-[0_2px_5px_rgba(213,217,217,0.5)]
 "
                onClick={() => {
                  addProductToCart(id, +quantities[id] || 1);
                }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
