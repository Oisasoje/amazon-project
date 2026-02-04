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

// ✅ FIXED: Proper TypeScript types
type Order = {
  orderId: string;
  orderDate: string;
  totalCents: number;
  products: Array<{
    id: string;
    quantity: number;
    deliveryDate: string;
  }>;
};

type OrderProduct = {
  id: string;
  quantity: number;
  deliveryDate: string;
};

type ProductDetails = {
  id: string;
  name: string;
  image: string;
  priceCents: number;
  rating?: {
    stars: number;
    count: number;
  };
};

// ✅ FIXED: Helper to calculate progress based on delivery date
const calculateDeliveryProgress = (deliveryDate: string): number => {
  const today = new Date();
  const delivery = new Date(deliveryDate);
  const orderDate = new Date(today);
  orderDate.setDate(today.getDate() - 7); // Assume ordered 7 days ago

  const totalTime = delivery.getTime() - orderDate.getTime();
  const elapsed = today.getTime() - orderDate.getTime();
  const progress = Math.min(Math.max((elapsed / totalTime) * 100, 0), 100);

  return progress;
};

const TrackingContent = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const productId = searchParams.get("productId");
  const { orders } = cartStore();

  const [order, setOrder] = useState<Order | null>(null);
  const [orderProduct, setOrderProduct] = useState<OrderProduct | null>(null);
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true); // ✅ FIXED: Loading state

  useEffect(() => {
    if (orderId && productId) {
      // Simulate async data fetching
      setTimeout(() => {
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

        setIsLoading(false);
      }, 100);
    } else {
      setIsLoading(false);
    }
  }, [orderId, productId, orders]);

  // ✅ FIXED: Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0f1111] text-[#212121] dark:text-white">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#febd69] border-r-transparent mb-4"></div>
          <p className="text-lg">Loading tracking information...</p>
        </div>
      </div>
    );
  }

  if (!order || !orderProduct || !productDetails) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center bg-white dark:bg-[#0f1111] text-[#212121] dark:text-white ${roboto.className}`}
      >
        <div className="text-center p-8 bg-[#f7f8fa] dark:bg-[#131921] rounded-lg border border-[#d5d9d9] dark:border-[#232f3e] shadow-xl">
          <h1 className="text-2xl font-bold mb-4">
            Order or Product Not Found
          </h1>
          <p className="text-[#565959] dark:text-[#9ca3af] mb-6">
            The tracking information you're looking for doesn't exist.
          </p>
          <Link
            href="/orders"
            className="inline-block bg-[#ffd814] text-[#0f1111] px-6 py-2 rounded-lg font-medium hover:bg-[#f7ca00] transition-colors"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  // ✅ FIXED: Dynamic progress calculation
  const deliveryProgress = calculateDeliveryProgress(orderProduct.deliveryDate);
  const isDelivered = deliveryProgress >= 100;
  const isShipped = deliveryProgress >= 33;

  return (
    <div
      className={`font-roboto min-h-screen bg-white dark:bg-[#0f1111] text-[#212121] dark:text-white ${roboto.className}`}
    >
      <Header />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[850px] mt-[90px] mb-[100px] px-[30px] mx-auto"
      >
        <Link
          className="inline-block mb-[30px] text-[#007185] dark:text-[#febd69] hover:text-[#c45000] dark:hover:text-[#ff9900] transition-colors font-medium"
          href="/orders"
        >
          &larr; View all orders
        </Link>

        <div className="text-[28px] font-bold mb-[10px]">
          {isDelivered ? (
            <>
              <span className="text-[#067d62]">Delivered</span> on{" "}
              {orderProduct.deliveryDate}
            </>
          ) : (
            <>
              Arriving on{" "}
              <span className="text-[#067d62]">
                {orderProduct.deliveryDate}
              </span>
            </>
          )}
        </div>

        <div className="mb-[10px] text-lg text-[#565959] dark:text-[#9ca3af]">
          {productDetails.name}
        </div>

        <div className="mb-[20px] text-[#565959] dark:text-[#9ca3af]">
          Quantity: {orderProduct.quantity}
        </div>

        <div className="bg-white p-4 rounded-lg inline-block mb-12 shadow-md">
          {/* ✅ FIXED: Using Next Image */}
          <Image
            width={200}
            height={200}
            className="max-w-[200px] max-h-[200px] object-contain"
            src={`/${productDetails.image}`}
            alt={productDetails.name}
          />
        </div>

        {/* Progress labels */}
        <div className="flex justify-between text-[18px] font-bold mb-[15px] max-[575px]:text-sm max-[450px]:flex-col max-[450px]:mb-[5px]">
          <div className="text-[#067d62]">Preparing</div>
          <div className={isShipped ? "text-[#067d62]" : "text-[#9ca3af]"}>
            Shipped
          </div>
          <div className={isDelivered ? "text-[#067d62]" : "text-[#9ca3af]"}>
            Delivered
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-[12px] w-full bg-[#e0e0e0] dark:bg-[#232f3e] border border-[#d5d9d9] dark:border-[#374151] rounded-full overflow-hidden">
          {/* ✅ FIXED: Correct gradient class and dynamic width */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${deliveryProgress}%` }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
            className="h-full bg-linear-to-r from-[#febd69] to-[#ff9900] rounded-full"
          ></motion.div>
        </div>

        {/* Status message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 p-4 bg-[#f7f8fa] dark:bg-[#131921] border border-[#d5d9d9] dark:border-[#232f3e] rounded-lg"
        >
          <p className="text-sm text-[#565959] dark:text-[#9ca3af]">
            {isDelivered ? (
              <span className="text-[#067d62] font-medium">
                ✓ Your package has been delivered!
              </span>
            ) : isShipped ? (
              <span className="text-[#febd69] font-medium">
                📦 Your package is on the way
              </span>
            ) : (
              <span className="text-[#9ca3af] font-medium">
                📋 Your order is being prepared
              </span>
            )}
          </p>
        </motion.div>

        {/* Order details */}
        <div className="mt-6 p-4 bg-[#f7f8fa] dark:bg-[#131921] border border-[#d5d9d9] dark:border-[#232f3e] rounded-lg">
          <h3 className="font-bold mb-2">Order Details</h3>
          <div className="text-sm text-[#565959] dark:text-[#9ca3af] space-y-1">
            <p>
              Order ID: <span className="font-mono">{order.orderId}</span>
            </p>
            <p>Order Date: {order.orderDate || "N/A"}</p>
            <p>Total: ${(order.totalCents / 100).toFixed(2)}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const TrackingPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white dark:bg-[#0f1111] flex items-center justify-center text-[#212121] dark:text-white">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#febd69] border-r-transparent mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      }
    >
      <TrackingContent />
    </Suspense>
  );
};

export default TrackingPage;
