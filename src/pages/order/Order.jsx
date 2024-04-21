import React, { useContext, useEffect, useMemo, useState } from "react";
import myContext from "../../context/data/myContext";
import Layout from "../../components/layout/Layout";
import Loader from "../../components/loader/Loader";
import SplitPane, { Pane } from "react-split-pane";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import ModalOrder from "../../components/modal/ModalOrder";

function Order() {
  // const userid = JSON.parse(localStorage.getItem('currentUser'))?.user.uid
  const context = useContext(myContext);
  const {
    mode,
    loading,
    setLoading,
    order,
    getOrdertDataFromUser,
    get_OneOrdertData,
    user_infor,
    getReviewDate,
    reviews,
    upDateOrderFromAdmin
  } = context;
  const navigate = useNavigate();
  useEffect(() => {
    console.log(user_infor);
    getOrdertDataFromUser(user_infor?.uid);
  }, []);

  const totalPrice = (cartItem) => {
    let total = 0;

    cartItem?.forEach((item) => {
      total = total + item?.price * item?.quantity;
    });

    return total;
  };

  const [showModal, setShowModal] = useState(false);
  const [reasonScanelOrder, setReasonScanelOrder] = useState();
  const [handdalProductToUpdate, setHanddalProductToUpdate] = useState({});
  const handelScancelOrder = async ()=>{
  setLoading(true)
   if(handdalProductToUpdate?.status == 'pending'){
    console.log(reasonScanelOrder)
    console.log(handdalProductToUpdate)
    setShowModal(false)
  await  upDateOrderFromAdmin(handdalProductToUpdate?.id, {status: "canceled", reasonScanelOrder} )
  getOrdertDataFromUser(user_infor?.uid);


   } else{
    
     toast("You cannot cancel this order")
   }
   setLoading(false)
  }
  const handlereview = async (obj_order, product_) => {
    /// const review = await getReviewDate(product_.id);
    // const find_product_in_preview = review.find((product) => {
    //   return (product.idProduct == product_.id && user_infor?.user?.uid == product_.uid);
    // });
    if (obj_order?.status != "completed") {
      return toast.error("The product has not been completed");
    }
    navigate(`/reviews/${product_.id}/${obj_order?.id}`);
  };
  return (
    <Layout>
      <ModalOrder
        showModal={showModal}
        setShowModal={setShowModal}
        reasonScanelOrder={reasonScanelOrder}
        setReasonScanelOrder={setReasonScanelOrder}
        handelScancelOrder={handelScancelOrder}
      ></ModalOrder>

      {loading && <Loader />}
      {order.length == 0 && <h1 className="text-center mt-5">Not Order</h1>}
      {order.length > 0 ? (
        <>
          {order?.map((item) => {
            return (
              <section class=" mb-5 mt-3 relative">
                <div class="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto">
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
                          Status Your Order
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
                          <button
                            type="button"
                            class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-1 me-2 mb-2 dark:bg-red-600
                         dark:hover:bg-red-700 dark:focus:ring-red-900"
                          >
                            Canceled
                          </button>
                        ) : (
                          " "
                        )}
                      </div>

                      <div class=" flex flex-col items-center  justify-between">
                        <p class="font-semibold text-base leading-7 text-black">
                          Action
                        </p>
                        <p class="font-semibold text-base leading-7 text-black mt-4">
                          <button
                            onClick={(e) => {
                              setShowModal(!showModal);
                              setHanddalProductToUpdate(item)
                            }}
                            type="button"
                            class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-1   dark:bg-red-200 dark:hover:bg-red-700 dark:focus:ring-red-900"
                          >
                            Scancel order
                          </button>
                        </p>
                      </div>
                    </div>
                    <div class="w-full px-3 min-[400px]:px-6">
                      {item?.cartItems.map((product) => {
                        return (
                          <div class="flex flex-col lg:flex-row items-center py-6 border-b border-gray-200 gap-6 w-full">
                            <div class="img-box max-lg:w-full">
                              <img
                                src={product?.imageUrl[0]}
                                alt="Premium Watch image"
                                class="aspect-square w-full lg:max-w-[140px]"
                              />
                            </div>
                            <div class="flex flex-row items-center w-full ">
                              <div class="grid grid-cols-1 lg:grid-cols-2 w-full">
                                <div class="flex items-center">
                                  <div class="">
                                    <h2 class="font-semibold text-xl leading-8 text-black mb-3">
                                      {product?.title}
                                    </h2>
                                    <p class="font-normal text-lg leading-8 text-gray-500 mb-3 ">
                                      By: Dust Studios
                                    </p>
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
                                  <div class="col-span-5 lg:col-span-2 flex items-center max-lg:mt-3 ">
                                    <div class="flex gap-3 lg:block">
                                      <p class="font-medium text-sm leading-7 text-black">
                                        Reviews
                                      </p>
                                      <button
                                        onClick={() => {
                                          handlereview(item, product);
                                        }}
                                        class={`   "font-medium text-sm leading-6 whitespace-nowrap py-1 px-5 rounded-full lg:mt-3 bg-emerald-50 text-emerald-600"
                                        ${
                                          item?.status === "completed" &&
                                          !product.reviewed
                                            ? "text-white bg-yellow-400 hover:bg-yellow-500"
                                            : product.reviewed
                                            ? "text-white bg-green-700 hover:bg-green-800"
                                            : " bg-slate-200 text-black"
                                        }  `}
                                      >
                                        Go
                                      </button>
                                    </div>
                                  </div>
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
                            {totalPrice(item?.cartItems) +20}$
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
    </Layout>
  );
}

export default Order;
