"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import cartStore from "@/store/cartStore";
import { motion } from "framer-motion";
import searchStore from "@/store/searchStore";
import { useMemo } from "react";

const Header = () => {
  const router = useRouter();
  const { cart } = cartStore();
  const { searchQuery, setSearchQuery } = searchStore();

  // ✅ FIXED: Efficient cart count using useMemo
  const totalCartItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.number, 0);
  }, [cart]);

  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      setSearchQuery(trimmedQuery);
      router.push("/");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="bg-[#131921] text-white px-[15px] flex items-center justify-between fixed top-0 left-0 right-0 h-[60px] z-50 border-b border-[#232f3e]">
      <div className="w-[180px] max-[800px]:w-auto">
        <Link
          href="/"
          className="inline-block p-[6px] rounded-[2px] cursor-pointer no-underline border border-transparent hover:border-white transition-colors"
        >
          <Image
            width={100}
            height={40}
            className="w-[100px] mt-[5px] max-[575px]:hidden"
            src="/images/amazon-logo-white.png"
            alt="Amazon logo"
            priority
          />
          <Image
            width={50}
            height={35}
            className="hidden max-[575px]:block h-[35px] mt-[5px]"
            src="/images/amazon-mobile-logo-white.png"
            alt="Amazon mobile logo"
            priority
          />
        </Link>
      </div>

      <div className="flex-1 max-w-[850px] mx-[10px] flex group">
        <input
          className="flex-1 w-0 text-[16px] h-[38px] pl-[15px] border-none rounded-l-[4px] bg-white text-black focus:outline-2 focus:outline-[#ff9900] placeholder:text-[#757575] rounded-r-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          type="text"
          placeholder="Search Amazon"
          aria-label="Search products"
        />

        <button
          className="bg-[#febd69] hover:bg-[#f3a847] transition-colors border-none w-[45px] h-[38px] rounded-r-[4px] flex items-center justify-center shrink-0 cursor-pointer"
          onClick={handleSearch}
          aria-label="Search"
        >
          <Image
            width={22}
            height={22}
            alt="Search"
            className="h-[22px]"
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

        <motion.button
          onClick={() => router.push("/checkout")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-1.5 rounded-xs leading-4.5 cursor-pointer border border-transparent hover:border-white text-white flex items-center relative transition-all bg-transparent"
          aria-label={`Shopping cart with ${totalCartItems} items`}
        >
          <Image
            width={50}
            height={40}
            className="w-[50px]"
            src="/images/icons/cart-icon.png"
            alt="Shopping cart"
          />

          <motion.div
            key={totalCartItems}
            initial={{ scale: 1.5, color: "#febd69" }}
            animate={{ scale: 1, color: "#f08804" }}
            transition={{ duration: 0.3 }}
            className="text-[#f08804] text-[16px] font-bold absolute top-[4px] left-[22px] w-[26px] text-center"
          >
            {totalCartItems}
          </motion.div>

          <div className="mt-[12px] text-[15px] font-bold">Cart</div>
        </motion.button>
      </div>
    </div>
  );
};

export default Header;
