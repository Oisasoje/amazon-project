"use client";

import Image from "next/image";
import Link from "next/link";
import products from "@/data/products";
import { Roboto } from "next/font/google";
import { useRouter } from "next/navigation";
import cartStore from "@/store/cartStore";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import Header from "@/app/components/Header";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const OrdersPage = () => {
  const { orders, addProductToCart } = cartStore();
  const router = useRouter();

  return (
    <div
      className={`font-roboto min-h-screen bg-white dark:bg-[#0f1111] text-[#212121] dark:text-white transition-colors ${roboto.className}`}
    >
      <Header />

      <div className="max-w-[850px] mt-[90px] mb-[100px] px-5 mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-bold text-[26px] mb-[25px]"
        >
          Your Orders
        </motion.div>

        <div className="grid grid-cols-1 gap-y-[50px]">
          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10 bg-[#131921] rounded-lg border border-[#232f3e] p-8"
            >
              <p className="text-[#9ca3af] mb-4">
                You haven't placed any orders yet.
              </p>
              <Link
                href="/"
                className="text-[#007185] dark:text-[#febd69] hover:text-[#c45000] dark:hover:text-[#ff9900] transition-colors"
              >
                Go shopping
              </Link>
            </motion.div>
          ) : (
            orders.map((order, index) => (
              <motion.div
                key={order.orderId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-[#232f3e] rounded-lg bg-[#131921] overflow-hidden"
              >
                <div className="bg-[#1a1f2e] border-b border-[#232f3e] flex items-center justify-between p-5 max-[575px]:flex-col max-[575px]:items-start max-[575px]:leading-[23px] max-[575px]:p-[15px] text-sm md:text-base">
                  <div className="flex shrink-0 max-[575px]:flex-col">
                    <div className="mr-[45px] max-[575px]:grid max-[575px]:grid-cols-[auto_1fr] max-[575px]:mr-0">
                      <div className="font-medium mr-1.25">Order Placed:</div>
                      <div className="text-[#565959] dark:text-[#9ca3af]">
                        {order.orderDate}
                      </div>
                    </div>
                    <div className="mr-[45px] max-[575px]:grid max-[575px]:grid-cols-[auto_1fr] max-[575px]:mr-0">
                      <div className="font-medium mr-1.25">Total:</div>
                      <div className="text-[#565959] dark:text-[#9ca3af]">
                        ${(order.totalCents / 100).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="shrink max-[575px]:grid max-[575px]:grid-cols-[auto_1fr]">
                    <div className="font-medium mr-1.25">Order ID:</div>
                    <div className="text-[#565959] dark:text-[#9ca3af]">
                      {order.orderId}
                    </div>
                  </div>
                </div>

                <div className="p-[40px_25px] grid grid-cols-[110px_1fr_220px] gap-x-[35px] gap-y-[60px] items-center max-[800px]:grid-cols-[110px_1fr] max-[800px]:row-gap-0 max-[800px]:pb-[8px] max-[450px]:grid-cols-1">
                  {order.products.map((orderProduct) => {
                    const product = products.find(
                      (p) => p.id === orderProduct.id,
                    );
                    if (!product) return null;

                    return (
                      <div key={orderProduct.id} className="contents">
                        <div className="text-center max-[450px]:mb-[25px]">
                          <div className="bg-white dark:bg-white rounded-md p-2 inline-block">
                            <img
                              alt={product.name}
                              src={`/${product.image}`}
                              className="max-w-[110px] max-h-[110px] mx-auto max-[450px]:max-w-[150px] max-[450px]:max-h-[150px] object-contain"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col">
                          <div className="font-bold mb-[5px] max-[450px]:mb-[10px] text-base">
                            {product.name}
                          </div>
                          <div className="mb-[3px] text-[#565959] dark:text-[#9ca3af]">
                            Arriving on: {orderProduct.deliveryDate}
                          </div>
                          <div className="mb-[8px] max-[450px]:mb-[15px] text-[#565959] dark:text-[#9ca3af]">
                            Quantity: {orderProduct.quantity}
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => addProductToCart(product.id, 1)}
                            className="flex items-center justify-center w-[140px] h-[36px] bg-[#ffd814] border border-[#fcbf00] rounded-lg cursor-pointer hover:bg-[#f7ca00] shadow-md text-[15px] text-[#0f1111] font-medium transition-all max-[800px]:mb-[10px] max-[450px]:w-full max-[450px]:mb-[15px]"
                          >
                            <img
                              alt="Buy again"
                              className="w-[25px] mr-[15px]"
                              src="/images/icons/buy-again.png"
                            />
                            <span>Buy it again</span>
                          </motion.button>
                        </div>

                        <div className="self-start max-[800px]:col-start-2 max-[800px]:mb-[30px] max-[450px]:col-auto max-[450px]:mb-[70px]">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() =>
                              router.push(
                                `/tracking?orderId=${order.orderId}&productId=${product.id}`,
                              )
                            }
                            className="w-full bg-white dark:bg-[#232f3e] border border-[#d5d9d9] dark:border-[#374151] rounded-lg cursor-pointer p-2 hover:bg-[#f7fafa] dark:hover:bg-[#2a3447] shadow-md text-[15px] transition-all max-[800px]:w-[140px] max-[450px]:w-full max-[450px]:p-[12px]"
                          >
                            Track package
                          </motion.button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
