import Image from "next/image";
import Link from "next/link";
import React from "react";
import products from "@/data/products";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const page = () => {
  return (
    <div className={`font-roboto ${roboto.className}`}>
      <div className="bg-[#131921] text-white px-[15px] flex items-center justify-between fixed top-0 left-0 right-0 h-[60px] z-100">
        <div className="w-[180px] max-[800px]:w-auto">
          <Link
            href="amazon.html"
            className="inline-block p-[6px] rounded-[2px] cursor-pointer no-underline border border-transparent hover:border-white"
          >
            <img
              className="w-[100px] mt-[5px] max-[575px]:hidden"
              src="/images/amazon-logo-white.png"
            />
            <img
              className="hidden max-[575px]:block h-[35px] mt-[5px]"
              src="/images/amazon-mobile-logo-white.png"
            />
          </Link>
        </div>

        <div className="flex-1 max-w-[850px] mx-[10px] flex">
          <input
            className="flex-1 w-0 text-[16px] h-[38px] pl-[15px] border-none rounded-l-[4px] bg-white focus:outline-2 focus:outline-[#ff9900] placeholder:text-[#212121] rounded-r-none"
            type="text"
            placeholder="Search"
          />

          <button className="bg-[#febd69] border-none w-[45px] h-[38px] rounded-r-[4px] flex items-center justify-center shrink-0">
            <Image
              width={20}
              height={20}
              alt="search-icon"
              className="h-[22px] ml-[2px] mt-[3px]"
              src="/images/icons/search-icon.png"
            />
          </button>
        </div>

        <div className="w-[180px] shrink-0 flex justify-end">
          <Link
            className="inline-block p-[6px] rounded-[2px] cursor-pointer no-underline border border-transparent hover:border-white text-white"
            href="orders.html"
          >
            <span className="block text-[13px]">Returns</span>
            <span className="block text-[15px] font-bold">& Orders</span>
          </Link>

          <Link
            className=" p-[6px] rounded-[2px] cursor-pointer no-underline border border-transparent hover:border-white text-white flex items-center relative"
            href="checkout.html"
          >
            <img className="w-[50px]" src="/images/icons/cart-icon.png" />
            <div className="text-[#f08804] text-[16px] font-bold absolute top-[4px] left-[22px] w-[26px] text-center">
              3
            </div>
            <div className="mt-[12px] text-[15px] font-bold">Cart</div>
          </Link>
        </div>
      </div>

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

              <div className="h-[40px] text-[15px] leading-5 tracking-wide">
                {name}
              </div>

              <div className="flex items-center mb-[7px]">
                <Image
                  unoptimized
                  width={20}
                  height={20}
                  alt="product-rating"
                  className="w-[100px] mr-[6px]"
                  src={`/images/ratings/rating-${rating.stars * 10}.png`}
                />
                <div className="text-[#017cb6] cursor-pointer mt-[3px] hover:text-[#c45000] ">
                  {rating.count}
                </div>
              </div>

              <div className="font-medium mb-[7px]">
                ${(priceCents / 100).toFixed(2)}
              </div>

              <div className="mb-[10px]">
                <select
                  defaultValue={1}
                  className="text-[#212121] bg-[#f0f0f0] focus:outline-2 focus:outline-[#ff9900]  font-[15px] border-[#d5d9d9] cursor-pointer border rounded-[8px] p-[3px_5px] "
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                </select>
              </div>

              <div className="flex-1"></div>

              <div className="text-[#067d62] text-base flex items-center mb-[8px] opacity-0">
                <Image
                  width={20}
                  height={20}
                  alt="product-added"
                  src="/images/icons/checkmark.png"
                />
                Added
              </div>

              <button
                className="w-full p-[8px] bg-[#ffd814] text-[#212121] cursor-pointer border border-[#fcbf00] rounded-full hover:bg-[#fcbf00] hover:text-[#212121] hover:border-[#fcbf00] text-sm shadow-[0_2px_5px_rgba(213,217,217,0.5)]
 "
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
