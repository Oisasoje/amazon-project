"use client";

import Image from "next/image";

import products from "@/data/products";
import { Roboto } from "next/font/google";

import cartStore from "@/store/cartStore";
import { useState, useMemo, useCallback, ChangeEvent } from "react";

import { motion, AnimatePresence } from "framer-motion";
import searchStore from "@/store/searchStore";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.2 },
  },
};

const Page = () => {
  const { addProductToCart } = cartStore();
  const { searchQuery } = searchStore();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [addedItems, setAddedItems] = useState<{ [key: string]: boolean }>({});

  const filteredProducts = useMemo(() => {
    const query = (searchQuery || "").toLowerCase().trim();

    if (!query) return products;

    return products.filter((product) =>
      product.name.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  const handleAddToCart = useCallback(
    (id: string) => {
      addProductToCart(id, quantities[id] || 1);
      setAddedItems((prev) => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setAddedItems((prev) => ({ ...prev, [id]: false }));
      }, 2000);
    },
    [addProductToCart, quantities],
  );

  const handleQuantityChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>, id: string) => {
      setQuantities((prev) => ({ ...prev, [id]: +e.target.value }));
    },
    [],
  );

  return (
    <div
      className={`font-roboto ${roboto.className} min-h-screen bg-[#0f1111] text-white`}
    >
      <div className="mt-[60px]">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-2xl text-gray-400 mb-2">No products found</p>
            <p className="text-sm text-gray-500">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 min-[450px]:grid-cols-1 min-[451px]:grid-cols-2 min-[576px]:grid-cols-3 min-[801px]:grid-cols-4 min-[1001px]:grid-cols-5 min-[1301px]:grid-cols-6 min-[1601px]:grid-cols-7 min-[2001px]:grid-cols-8">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map(
                ({ id, image, name, rating, priceCents }) => (
                  <motion.div
                    key={id}
                    layout
                    variants={itemVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    whileHover={{ backgroundColor: "#1e293b" }}
                    className="pt-[40px] pb-[25px] px-[25px] border-r border-b border-[#232f3e] flex flex-col transition-colors duration-200"
                  >
                    <div className="relative h-[180px] w-full mb-5 bg-white rounded-md p-4 group">
                      <Image
                        alt={`${name} product image`}
                        src={`/${image}`}
                        fill
                        sizes="(max-width: 450px) 100vw, (max-width: 576px) 50vw, (max-width: 801px) 33vw, (max-width: 1001px) 25vw, (max-width: 1301px) 20vw, (max-width: 1601px) 16vw, 14vw"
                        className="object-contain overflow-hidden p-2 group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    <div className="h-[40px] text-[15px] leading-5 line-clamp-2 tracking-wide text-[#e5e7eb] hover:text-[#febd69] transition-colors cursor-pointer mb-2">
                      {name}
                    </div>

                    <div className="flex items-center mb-[7px]">
                      <Image
                        width={100}
                        height={20}
                        alt={`${rating.stars} star rating`}
                        className="mr-1.5"
                        src={`/images/ratings/rating-${rating.stars * 10}.png`}
                        sizes="100px"
                      />
                      <div className="text-[#febd69] text-sm cursor-pointer mt-0.75 hover:text-[#ff9900] transition-colors">
                        {rating.count}
                      </div>
                    </div>

                    <div className="font-bold text-lg mb-2 text-[#febd69]">
                      ${(priceCents / 100).toFixed(2)}
                    </div>

                    <div className="mb-4">
                      <label htmlFor={`quantity-${id}`} className="sr-only">
                        Quantity for {name}
                      </label>
                      <select
                        id={`quantity-${id}`}
                        aria-label={`Select quantity for ${name}`}
                        className="text-white bg-[#232f3e] border-[#374151] focus:ring-2 focus:ring-[#ff9900] text-sm border rounded-md px-2 py-1 w-20 cursor-pointer outline-none"
                        onChange={(e) => handleQuantityChange(e, id)}
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
                      <AnimatePresence mode="wait">
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
                              alt="Checkmark icon"
                              src="/images/icons/checkmark.png"
                              className="mr-1"
                              sizes="20px"
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
                      aria-label={`Add ${name} to cart`}
                    >
                      Add to Cart
                    </motion.button>
                  </motion.div>
                ),
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
