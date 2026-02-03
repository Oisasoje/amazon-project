"use client";

import Image from "next/image";
import Link from "next/link";
import products from "@/data/products";
import { Roboto } from "next/font/google";
import { useRouter } from "next/navigation";
import cartStore from "@/store/cartStore";
import { useState } from "react";

import { motion, AnimatePresence, Variants } from "framer-motion";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const page = () => {
  const { cart, addProductToCart } = cartStore();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [addedItems, setAddedItems] = useState<{ [key: string]: boolean }>({});
  const router = useRouter();

  const handleAddToCart = (id: string) => {
    addProductToCart(id, +quantities[id] || 1);
    setAddedItems((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  return (
    <div
      className={`font-roboto ${roboto.className} min-h-screen bg-[#0f1111] text-white`}
    >
      <div className="mt-[60px]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 min-[450px]:grid-cols-1 min-[451px]:grid-cols-2 min-[576px]:grid-cols-3 min-[801px]:grid-cols-4 min-[1001px]:grid-cols-5 min-[1301px]:grid-cols-6 min-[1601px]:grid-cols-7 min-[2001px]:grid-cols-8"
        >
          {products.map(({ id, image, name, rating, priceCents }) => (
            <motion.div
              key={id}
              variants={itemVariants}
              whileHover={{ backgroundColor: "#1e293b" }}
              whileTap={{ scale: 0.95 }}
              className="pt-[40px] pb-[25px] px-[25px] border-r border-b border-[#232f3e] flex flex-col transition-colors duration-200"
            >
              <div className="relative h-[180px] w-full mb-5 bg-white rounded-md p-4 group">
                <Image
                  alt="product-image"
                  src={`/${image}`}
                  fill
                  className="object-contain overflow-hidden p-2 group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              <div className="h-[40px] text-[15px] leading-5 line-clamp-2 tracking-wide text-[#e5e7eb] hover:text-[#febd69] transition-colors cursor-pointer mb-2">
                {name}
              </div>

              <div className="flex items-center mb-[7px]">
                <Image
                  unoptimized
                  width={100}
                  height={20}
                  alt="product-rating"
                  className="mr-1.5"
                  src={`/images/ratings/rating-${rating.stars * 10}.png`}
                />
                <div className="text-[#febd69] text-sm cursor-pointer mt-0.75 hover:text-[#ff9900] transition-colors">
                  {rating.count}
                </div>
              </div>

              <div className="font-bold text-lg mb-2 text-[#febd69]">
                ${(priceCents / 100).toFixed(2)}
              </div>

              <div className="mb-4">
                <select
                  className="text-white bg-[#232f3e] border-[#374151] focus:ring-2 focus:ring-[#ff9900] text-sm border rounded-md px-2 py-1 w-20 cursor-pointer outline-none"
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

              <div className="h-6 mb-2">
                <AnimatePresence>
                  {addedItems[id] && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-[#067d62] text-sm flex items-center font-medium"
                    >
                      <Image
                        width={20}
                        height={20}
                        alt="product-added"
                        src="/images/icons/checkmark.png"
                        className="mr-1"
                      />
                      Added to Cart
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full p-2 bg-[#ffd814] text-[#0f1111] font-medium cursor-pointer border border-[#fcbf00] rounded-full hover:bg-[#fcbf00] transition-all text-sm shadow-md"
                onClick={() => handleAddToCart(id)}
              >
                Add to Cart
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default page;
