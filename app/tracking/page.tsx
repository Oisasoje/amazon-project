"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import cartStore from "@/store/cartStore";
import products from "@/data/products";
import { Roboto } from "next/font/google";
import { useEffect, useState, Suspense } from "react";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const TrackingContent = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const productId = searchParams.get("productId");
  const { orders, cart } = cartStore();

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

  const cartItemCount = cart.reduce((acc, item) => acc + item.number, 0);

  if (!order || !orderProduct || !productDetails) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${roboto.className}`}
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Order or Product Not Found
          </h1>
          <Link
            href="/orders"
            className="text-[#007185] hover:text-[#c45000] underline underline-offset-2"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`font-roboto min-h-screen bg-white ${roboto.className}`}>
      {/* Header - Shared with app/page.tsx */}
      <div className="bg-[#131921] text-white px-[15px] flex items-center justify-between fixed top-0 left-0 right-0 h-[60px] z-1000">
        <div className="w-[180px] max-[800px]:w-auto">
          <Link
            href={"/"}
            className="inline-block p-[6px] rounded-[2px] cursor-pointer no-underline border border-transparent hover:border-white"
          >
            <img
              alt="Amazon logo"
              className="w-[100px] mt-[5px] max-[575px]:hidden"
              src="/images/amazon-logo-white.png"
            />
            <img
              alt="Amazon mobile logo"
              className="hidden max-[575px]:block h-[35px] mt-[5px]"
              src="/images/amazon-mobile-logo-white.png"
            />
          </Link>
        </div>

        <div className="flex-1 max-w-[850px] mx-[10px] flex">
          <input
            className="flex-1 w-0 text-[16px] h-[38px] pl-[15px] border-none rounded-l-[4px] bg-white focus:outline-2 focus:outline-[#ff9900] placeholder:text-[#757575] text-black"
            type="text"
            placeholder="Search"
          />

          <button className="bg-[#febd69] border-none w-[45px] h-[38px] rounded-r-[4px] flex items-center justify-center shrink-0 cursor-pointer">
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
            className="inline-block p-1.5 rounded-xs leading-4.5 cursor-pointer no-underline border border-transparent hover:border-white text-white"
            href="/orders"
          >
            <span className="block text-[13px]">Returns</span>
            <span className="block text-[15px] font-bold">& Orders</span>
          </Link>

          <Link
            href="/checkout"
            className="p-1.5 rounded-xs leading-4.5 cursor-pointer no-underline border border-transparent hover:border-white text-white flex items-center relative"
          >
            <img
              alt="Cart"
              className="w-[50px]"
              src="/images/icons/cart-icon.png"
            />
            <div className="text-[#f08804] text-[16px] font-bold absolute top-[4px] left-[22px] w-[26px] text-center">
              {cartItemCount}
            </div>
            <div className="mt-[12px] text-[15px] font-bold">Cart</div>
          </Link>
        </div>
      </div>

      <div className="max-w-[850px] mt-[90px] mb-[100px] px-[30px] mx-auto text-[#212121]">
        <Link
          className="inline-block mb-[30px] text-[#007185] hover:text-[#c45000]"
          href="/orders"
        >
          View all orders
        </Link>

        <div className="text-[25px] font-bold mb-[10px]">
          Arriving on {orderProduct.deliveryDate}
        </div>

        <div className="mb-[3px]">{productDetails.name}</div>

        <div className="mb-[3px]">Quantity: {orderProduct.quantity}</div>

        <img
          className="max-w-[150px] max-h-[150px] mt-[25px] mb-[50px]"
          src={`/${productDetails.image}`}
          alt={productDetails.name}
        />

        <div className="flex justify-between text-[20px] font-medium mb-[15px] max-[575px]:text-base max-[450px]:flex-col max-[450px]:mb-[5px]">
          <div className="max-[450px]:mb-[3px]">Preparing</div>
          <div className="text-[rgb(6,125,98)] max-[450px]:mb-[3px]">
            Shipped
          </div>
          <div className="max-[450px]:mb-[3px]">Delivered</div>
        </div>

        <div className="h-[25px] w-full border border-[rgb(200,200,200)] rounded-[50px] overflow-hidden">
          <div className="h-full bg-green-600 rounded-[50px] w-[50%]"></div>
        </div>
      </div>
    </div>
  );
};

const TrackingPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TrackingContent />
    </Suspense>
  );
};

export default TrackingPage;
