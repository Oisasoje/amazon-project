"use client";

import Image from "next/image";
import Link from "next/link";
import products from "@/data/products";
import { Roboto } from "next/font/google";
import { useRouter } from "next/navigation";
import cartStore from "@/store/cartStore";
import dayjs from "dayjs";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const OrdersPage = () => {
  const { orders, addProductToCart } = cartStore();
  const router = useRouter();

  return (
    <div className={`font-roboto min-h-screen bg-white ${roboto.className}`}>
      <div className="max-w-[850px] mt-[90px] mb-[100px] px-5 mx-auto text-[#212121]">
        <div className="font-bold text-[26px] mb-[25px]">Your Orders</div>

        <div className="grid grid-cols-1 gap-y-[50px]">
          {orders.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-4">
                You haven't placed any orders yet.
              </p>
              <Link href="/" className="text-[#007185] hover:text-[#c45000]">
                Go shopping
              </Link>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.orderId}
                className="border border-[#d5d9d9] rounded-lg"
              >
                <div className="bg-[#f0f2f2] border-b border-[#d5d9d9] flex items-center justify-between p-5 max-[575px]:flex-col max-[575px]:items-start max-[575px]:leading-[23px] max-[575px]:p-[15px] rounded-t-lg text-sm md:text-base">
                  <div className="flex shrink-0 max-[575px]:flex-col">
                    <div className="mr-[45px] max-[575px]:grid max-[575px]:grid-cols-[auto_1fr] max-[575px]:mr-0">
                      <div className="font-medium mr-1.25">Order Placed:</div>
                      <div className="text-[#565959] md:text-[#212121]">
                        {order.orderDate}
                      </div>
                    </div>
                    <div className="mr-[45px] max-[575px]:grid max-[575px]:grid-cols-[auto_1fr] max-[575px]:mr-0">
                      <div className="font-medium mr-1.25">Total:</div>
                      <div className="text-[#565959] md:text-[#212121]">
                        ${(order.totalCents / 100).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="shrink max-[575px]:grid max-[575px]:grid-cols-[auto_1fr]">
                    <div className="font-medium mr-1.25">Order ID:</div>
                    <div className="text-[#565959] md:text-[#212121]">
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
                          <img
                            alt={product.name}
                            src={`/${product.image}`}
                            className="max-w-[110px] max-h-[110px] mx-auto max-[450px]:max-w-[150px] max-[450px]:max-h-[150px]"
                          />
                        </div>

                        <div className="flex flex-col">
                          <div className="font-bold mb-[5px] max-[450px]:mb-[10px] text-base">
                            {product.name}
                          </div>
                          <div className="mb-[3px]">
                            Arriving on: {orderProduct.deliveryDate}
                          </div>
                          <div className="mb-[8px] max-[450px]:mb-[15px]">
                            Quantity: {orderProduct.quantity}
                          </div>
                          <button
                            onClick={() => addProductToCart(product.id, 1)}
                            className="flex items-center justify-center w-[140px] h-[36px] bg-[#ffd814] border border-[#fcbf00] rounded-lg cursor-pointer hover:bg-[#f7ca00] shadow-[0_2px_5px_rgba(213,217,217,0.5)] text-[15px] max-[800px]:mb-[10px] max-[450px]:w-full max-[450px]:mb-[15px]"
                          >
                            <img
                              alt="Buy again"
                              className="w-[25px] mr-[15px]"
                              src="/images/icons/buy-again.png"
                            />
                            <span>Buy it again</span>
                          </button>
                        </div>

                        <div className="self-start max-[800px]:col-start-2 max-[800px]:mb-[30px] max-[450px]:col-auto max-[450px]:mb-[70px]">
                          <button
                            onClick={() =>
                              router.push(
                                `/tracking?orderId=${order.orderId}&productId=${product.id}`,
                              )
                            }
                            className="w-full bg-white border border-[#d5d9d9] rounded-lg cursor-pointer p-2 hover:bg-[#f7fafa] shadow-[0_2px_5px_rgba(213,217,217,0.5)] text-[15px] max-[800px]:w-[140px] max-[450px]:w-full max-[450px]:p-[12px]"
                          >
                            Track package
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
