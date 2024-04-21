import React, { useContext, useEffect, useMemo, useState } from "react";
import myContext from "../../../../context/data/myContext";
import Layout from "../../../../components/layout/Layout";
import Loader from "../../../../components/loader/Loader";
import SplitPane, { Pane } from "react-split-pane";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import ModalOrder from "../../../../components/modal/ModalOrder";

function Order() {
  // const userid = JSON.parse(localStorage.getItem('currentUser'))?.user.uid
  const context = useContext(myContext);
  const {
    mode,
    loading,
    setLoading,
    orders,
    getOrdertDataFromUser,
    get_OneOrdertData,
    user_infor,
    getReviewDate,
    reviews,
    upDateOrderFromAdmin,
    get_OneProductData,
    update_inventoryAndSelling_Product,
    getOrderData,
  } = context;
  const navigate = useNavigate();

  useEffect(() => {
    getOrderData();
  }, []);
  const [statusOrder, setStatusOrder] = useState(null);
  const [orderLocal, setOrderLocal] = useState(null);
  const handleStatusOrder = (e) => {
    setStatusOrder(e.target.value);
  };
  const handleOrder = (order) => {
    console.log(order);
    setOrderLocal(order);
  };
  const update_inventoryAndSelling = async () => {
    try {
      orderLocal?.cartItems?.forEach(async (product) => {
        const product_local = await get_OneProductData(product.id);
        console.log(product);
        const data_update = {
          id: product.id,
          inventory_quantity:
            product_local?.inventory_quantity - product?.quantity,
          selling_strategy: product_local?.selling_strategy + product?.quantity,
        };

        await update_inventoryAndSelling_Product(data_update);
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (orderLocal?.id && orderLocal?.status !='completed') {
      upDateOrderFromAdmin(orderLocal?.id, { status: statusOrder });
      if (statusOrder == "completed") {
        update_inventoryAndSelling();
      }
    }
    else if(orderLocal?.id && orderLocal?.status =='completed'){
       toast("This order has been completed")
    }
  }, [statusOrder]);

  const totalPrice = (cartItem) => {
    let total = 0;

    cartItem?.forEach((item) => {
      total = total + item?.price * item?.quantity;
    });

    return total;
  };

  return (
    <>
      {loading && <Loader />}
      {orders.length == 0 && <h1 className="text-center mt-5">Not Order</h1>}
      {orders.length > 0 ? (
        <>
          {orders?.map((item) => {
            return (
              <section class=" mb-5 mt-3 relative">
                <div class="w-full  lg-6 mx-auto">
                  <div class="main-box border border-gray-200 rounded-xl pt-6 max-w-xl max-lg:mx-auto lg:max-w-full">
                    <div class="flex flex-col lg:flex-row lg:items-center justify-between px-6 pb-6 border-b border-gray-200">
                      <div class="data">
                        <p class="font-semibold text-base leading-7 text-black">
                          Order Id:{" "}
                          <span class="text-indigo-600 font-medium">
                            #{item?.id}
                          </span>
                        </p>
                        <p class="font-semibold text-base leading-7 text-black mt-4">
                          Order Payment :{" "}
                          <span class="text-gray-400 font-medium">
                            {item?.date}
                          </span>
                        </p>
                      </div>

                      <div className="flex flex-col md:items-center md:justify-center gap-5">
                        <div className="font-semibold text-base leading-7 text-black">
                          Status Order
                        </div>

                        {item?.status === "confirmed" ? (
                          <button
                            type="button"
                            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-1 me-2 mb-2
                         dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                          >
                            Confirmed
                          </button>
                        ) : item?.status === "pending" ? (
                          <button
                            type="button"
                            class="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-2 py-1  dark:focus:ring-yellow-900"
                          >
                            Pending...
                          </button>
                        ) : item?.status === "completed" ? (
                          <button
                            type="button"
                            class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-2 py-1 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                          >
                            Completed
                          </button>
                        ) : item?.status === "canceled" ? (
                          <div className="group">
                            <button
                              type="button"
                              class="    focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-1 me-2 mb-2 dark:bg-red-600
                         dark:hover:bg-red-700 dark:focus:ring-red-900"
                            >
                              Canceled
                            </button>
                            <div className="group-hover:flex hidden absolute bg-red-300 z-10 p-3 rounded-sm text-black">
                              {" "}
                              <span>Reasons from the buyer: {"  "} </span>{" "}
                              {item?.reasonScanelOrder}
                            </div>
                          </div>
                        ) : (
                          " "
                        )}
                      </div>

                      <div class=" flex flex-col items-center  justify-between">
                        <p class="font-semibold text-base leading-7 text-black">
                          Action
                        </p>
                        <p class="font-semibold text-base leading-7 text-black mt-4">
                          <div
                            class="flex "
                            onClick={() => {
                              handleOrder(item);
                            }}
                          >
                            <select
                              onChange={handleStatusOrder}
                              value={item.status}
                              class={`text-gray-900  border border-gray-300 focus:outline-none
                           focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-2 py-1 
                             
                               ${
                                 item.status === "confirmed"
                                   ? "bg-blue-700 hover:bg-blue-800 text-white"
                                   : item.status === "pending"
                                   ? "text-white bg-yellow-400 hover:bg-yellow-500"
                                   : item.status === "canceled"
                                   ? "text-white bg-red-700 hover:bg-red-800"
                                   : item.status === "completed"
                                   ? "  text-white bg-green-700 hover:bg-green-800"
                                   : ""
                               } `}
                            >
                              <option className="  bg-black" value="pending">
                                {" "}
                                Pending...
                              </option>
                              <option className="  bg-black" value="confirmed">
                                Confirmed
                              </option>
                              <option className="  bg-black" value="canceled">
                                Canceled
                              </option>
                              <option className="  bg-black" value="completed">
                                Completed
                              </option>
                            </select>
                            {/* </span> */}
                          </div>
                        </p>
                      </div>
                    </div>
                    <div class="w-full px-3 min-[400px]:px-6">
                      {item?.cartItems?.map((product) => {
                        return (
                          <div class="flex flex-col lg:flex-row  items-center  justify-between py-6 border-b border-gray-200 gap-6 w-full">
                            <div class="img-box  w-1/2 flex flex-wrap">
                              {product?.imageUrl?.map((imag) => {
                                return (
                                  <img
                                    src={imag}
                                    alt="Premium Watch image"
                                    class="aspect-square w-full lg:max-w-[140px]"
                                  />
                                );
                              })}
                            </div>
                            <div class="flex flex-row items-center w-full   justify-between ">
                              <div class="grid grid-cols-1 lg:grid-cols-2 w-full ">
                                <div class="flex items-center">
                                  <div class="">
                                   <div className="flex gap-3 items-center">
                                    <div  className="font-medium text-base leading-7  text-black ">
                                      Title:
                                    </div>
                                   <h2 class="line-clamp-1">
                                      {product?.title}
                                    </h2>

                                   </div>
                                    <div class="flex items-center ">
                                      <p class="font-medium text-base leading-7 text-black pr-4 mr-4 border-r border-gray-200">
                                        Size:{" "}
                                        <span class="text-gray-500">
                                          {product?.size}
                                        </span>
                                      </p>
                                      <p class="font-medium text-base leading-7 text-black pr-4 mr-4 border-r border-gray-200">
                                        Color:{" "}
                                        <span class="text-gray-500">
                                          {product?.color}
                                        </span>
                                      </p>
                                      <p class="font-medium text-base leading-7 text-black ">
                                        Qty:{" "}
                                        <span class="text-gray-500">
                                          {product?.quantity}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div class="grid grid-cols-5">
                                  <div class="col-span-5 lg:col-span-1 flex items-center max-lg:mt-3">
                                    <div class="flex gap-3 lg:block">
                                      <p class="font-medium text-sm leading-7 text-black">
                                        Price
                                      </p>
                                      <p class="lg:mt-4 font-medium text-sm leading-7 text-indigo-600">
                                        {product?.price}$ x {product?.quantity}
                                      </p>
                                    </div>
                                  </div>
                                  <div class="col-span-5 lg:col-span-2 flex items-center max-lg:mt-3">
                                    <div class="flex gap-3 lg:block">
                                      <p class="font-medium text-sm whitespace-nowrap leading-7 text-black">
                                        Total price
                                      </p>
                                      <p class="font-medium text-base whitespace-nowrap leading-7 lg:mt-4 text-emerald-500">
                                        {product?.price * product?.quantity}$
                                      </p>
                                    </div>
                                  </div>
                                  <div class="col-span-5 lg:col-span-2 flex items-center max-lg:mt-3 "></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div class="w-full border-t border-gray-200 px-6 flex flex-col lg:flex-row items-start justify-between ">
                      <div class="flex flex-col  items-start  max-lg:border-b border-gray-200">
                        <p class="font-medium text-lg text-gray-900  py-3 max-lg:text-center">
                          Address:{" "}
                          <span class="text-indigo-600">
                            {" "}
                            {item?.addressInfo?.province} ,
                            {item?.addressInfo?.district},
                            {item?.addressInfo?.ward}
                          </span>
                        </p>

                        <p class="font-medium text-lg text-gray-900  py-3 max-lg:text-center">
                          Phone number:{" "}
                          <span class="text-indigo-600">
                            {item?.addressInfo?.phoneNumber}
                          </span>
                        </p>

                        <p class="font-semibold text-lg text-black py-6">
                          Name:{" "}
                          <span class="text-indigo-600">
                            {item?.addressInfo?.name}
                          </span>
                        </p>
                      </div>
                      <div className="flex flex-col  justify-start ">
                        {item?.addressInfo?.paidFor ? (
                          <p class="font-medium text-lg text-gray-900  py-3 max-lg:text-center">
                            Payment:{" "}
                            <span class="text-indigo-600">
                              Paid using Paypal by{" "}
                              {
                                item?.addressInfo?.paidFor?.payer?.name
                                  ?.given_name
                              }
                            </span>
                          </p>
                        ) : (
                          <p class="font-medium text-lg text-gray-900  py-3 max-lg:text-center">
                            Payment:{" "}
                            <span class="text-indigo-600">
                              Payment on delivery{" "}
                            </span>
                          </p>
                        )}

                        <p class="font-semibold text-lg text-black py-6">
                          Shipping: <span class="text-indigo-600"> 20$</span>
                        </p>
                        <p class="font-semibold text-lg text-black py-6">
                          Total Price:{" "}
                          <span class="text-indigo-600">
                            {" "}
                            {totalPrice(item?.cartItems) + 20}$
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </>
      ) : (
        <h2 className=" text-center tex-2xl text-white">Not Order</h2>
      )}
    </>
  );
}

export default Order;
