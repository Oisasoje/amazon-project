"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import cartStore from "@/store/cartStore";
import products from "@/data/products";
import { Roboto } from "next/font/google";
import { useEffect, useState, Suspense } from "react";
import Header from "@/app/components/Header";
import { motion } from "framer-motion";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const TrackingContent = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const productId = searchParams.get("productId");
  const { orders } = cartStore();

  const [order, setOrder] = useState<any>(null);
  const [orderProduct, setOrderProduct] = useState<any>(null);
  const [productDetails, setProductDetails] = useState<any>(null);

  useEffect(() => {
    if (orderId && productId) {
      const foundOrder = orders.find((o) => o.orderId === orderId);
      if (foundOrder) {
        setOrder(foundOrder);
        const foundOrderProduct = foundOrder.products.find(
          (p) => p.id === productId,
        );
        if (foundOrderProduct) {
          setOrderProduct(foundOrderProduct);
        }
      }

      const foundProductDetails = products.find((p) => p.id === productId);
      if (foundProductDetails) {
        setProductDetails(foundProductDetails);
      }
    }
  }, [orderId, productId, orders]);

  if (!order || !orderProduct || !productDetails) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center bg-[#0f1111] text-white ${roboto.className}`}
      >
        <div className="text-center p-8 bg-[#131921] rounded-lg border border-[#232f3e] shadow-xl">
          <h1 className="text-2xl font-bold mb-4">
            Order or Product Not Found
          </h1>
          <Link
            href="/orders"
            className="text-[#febd69] hover:text-[#ff9900] underline underline-offset-4 transition-colors"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`font-roboto min-h-screen bg-[#0f1111] text-white ${roboto.className}`}
    >
      <Header />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[850px] mt-[90px] mb-[100px] px-[30px] mx-auto"
      >
        <Link
          className="inline-block mb-[30px] text-[#febd69] hover:text-[#ff9900] transition-colors"
          href="/orders"
        >
          &larr; View all orders
        </Link>

        <div className="text-[28px] font-bold mb-[10px] text-white">
          Arriving on{" "}
          <span className="text-[#067d62]">{orderProduct.deliveryDate}</span>
        </div>

        <div className="mb-[10px] text-lg text-[#9ca3af]">
          {productDetails.name}
        </div>

        <div className="mb-[20px] text-[#9ca3af]">
          Quantity: {orderProduct.quantity}
        </div>

        <div className="bg-white p-4 rounded-lg inline-block mb-12 shadow-inner">
          <img
            className="max-w-[200px] max-h-[200px] object-contain"
            src={`/${productDetails.image}`}
            alt={productDetails.name}
          />
        </div>

        <div className="flex justify-between text-[18px] font-bold mb-[15px] max-[575px]:text-sm max-[450px]:flex-col max-[450px]:mb-[5px]">
          <div className="text-[#9ca3af]">Preparing</div>
          <div className="text-[#067d62]">Shipped</div>
          <div className="text-[#9ca3af]">Delivered</div>
        </div>

        <div className="h-[12px] w-full bg-[#232f3e] border border-[#374151] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "50%" }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
            className="h-full bg-linear-to-r from-[#febd69] to-[#ff9900] rounded-full"
          ></motion.div>
        </div>
      </motion.div>
    </div>
  );
};

const TrackingPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0f1111] flex items-center justify-center text-white">
          Loading...
        </div>
      }
    >
      <TrackingContent />
    </Suspense>
  );
};

export default TrackingPage;
