"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import cartStore from "@/store/cartStore";
import { motion } from "framer-motion";

const Header = () => {
  const router = useRouter();
  const { cart } = cartStore();

  let number = 0;
  cart.forEach((cartItem) => {
    number += cartItem.number;
  });

  return (
    <div className="bg-[#131921] text-white px-[15px] flex items-center justify-between fixed top-0 left-0 right-0 h-[60px] z-100 border-b border-[#232f3e]">
      <div className="w-[180px] max-[800px]:w-auto">
        <Link
          href="/"
          className="inline-block p-[6px] rounded-[2px] cursor-pointer no-underline border border-transparent hover:border-white transition-colors"
        >
          <img
            className="w-[100px] mt-[5px] max-[575px]:hidden"
            src="/images/amazon-logo-white.png"
            alt="Amazon logo"
          />
          <img
            className="hidden max-[575px]:block h-[35px] mt-[5px]"
            src="/images/amazon-mobile-logo-white.png"
            alt="Amazon mobile logo"
          />
        </Link>
      </div>

      <div className="flex-1 max-w-[850px] mx-[10px] flex group">
        <input
          className="flex-1 w-0 text-[16px] h-[38px] pl-[15px] border-none rounded-l-[4px] bg-white text-black focus:outline-2 focus:outline-[#ff9900] placeholder:text-[#757575] rounded-r-none"
          type="text"
          placeholder="Search Amazon"
        />

        <button className="bg-[#febd69] hover:bg-[#f3a847] transition-colors border-none w-[45px] h-[38px] rounded-r-[4px] flex items-center justify-center shrink-0">
          <Image
            width={20}
            height={20}
            alt="search-icon"
            className="h-[22px] ml-[2px] mt-[3px]"
            src="/images/icons/search-icon.png"
          />
        </button>
      </div>

      <div className="w-[180px] shrink-0 flex justify-end items-center gap-2">
        <Link
          className="inline-block p-1.5 rounded-xs leading-4.5 cursor-pointer no-underline border border-transparent hover:border-white text-white transition-all"
          href="/orders"
        >
          <span className="block text-[13px]">Returns</span>
          <span className="block text-[15px] font-bold">& Orders</span>
        </Link>

        <motion.div
          onClick={() => {
            router.push("/checkout");
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-1.5 rounded-xs leading-4.5 cursor-pointer no-underline border border-transparent hover:border-white text-white flex items-center relative transition-all"
        >
          <img className="w-[50px]" src="/images/icons/cart-icon.png" />
          <motion.div
            key={number}
            initial={{ scale: 1.5, color: "#febd69" }}
            animate={{ scale: 1, color: "#f08804" }}
            className="text-[#f08804] text-[16px] font-bold absolute top-[4px] left-[22px] w-[26px] text-center"
          >
            {number}
          </motion.div>
          <div className="mt-[12px] text-[15px] font-bold">Cart</div>
        </motion.div>
      </div>
    </div>
  );
};

export default Header;
