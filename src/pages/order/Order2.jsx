import React, { useContext, useEffect, useMemo } from "react";
import myContext from "../../context/data/myContext";
import Layout from "../../components/layout/Layout";
import Loader from "../../components/loader/Loader";
import SplitPane, { Pane } from "react-split-pane";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

function Order() {
  // const userid = JSON.parse(localStorage.getItem('currentUser'))?.user.uid
  const context = useContext(myContext);
  const {
    mode,
    loading,
    order,
    getOrdertDataFromUser,
    get_OneOrdertData,
    user_infor,
    getReviewDate,
    reviews,
  } = context;
const navigate = useNavigate()
  useEffect(() => {
    console.log(user_infor);
    getOrdertDataFromUser(user_infor?.uid);
  }, []);

  const handlereview = async (obj_order, product_) => {
    
   /// const review = await getReviewDate(product_.id);
    // const find_product_in_preview = review.find((product) => {
    //   return (product.idProduct == product_.id && user_infor?.user?.uid == product_.uid);
    // });
    if (obj_order?.status != "completed") {
      return toast.error("The product has not been completed");
    }
    navigate(`/reviews/${product_.id}/${obj_order?.id}`)

  };
  return (
    <Layout>
      {/* {order.map((item, index) => {
        return (
          <div key={index}>
            <SplitPane split="vertical" className="border border-yellow-500">
              <div>
                <tbody>
                  <tr>
                    <td class="px-6 py-4">{item.addressInfo.address}</td>
                    <td class="px-6 py-4">{item.addressInfo.name}</td>
                    <td class="px-6 py-4">{item.addressInfo.phoneNumber}</td>
                  </tr>
                </tbody>
              </div>
              <div>Pane 3</div>
              <div>Pane 3</div>
              <div>Pane 4</div>
              <div>Pane 5</div>
            </SplitPane>
          </div>
        );
      })} */}

      {loading && <Loader />}
      {order.length ==0 && (<h1 className="text-center mt-5">
        Not Order
      </h1>)}
      {order.length > 0 ? (
        <>
          <div className="   overflow-auto h-full w-[100%] pt-10 p-5">
            <table class=" w-full  border-collapse  border-slate-500relative border   overflow-auto  p-3 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-white">
                <tr>
                  <th scope="col" class="border border-slate-600">
                    <div class="flex items-center">
                      <input
                        id="checkbox-all-search"
                        type="checkbox"
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label for="checkbox-all-search" class="sr-only">
                        checkbox
                      </label>
                    </div>
                  </th>
                  <th scope="col" class="border border-slate-700  px-6 py-3">
                    Buyer Infor
                  </th>
                  <th scope="col" class=" border border-slate-700 px-6 py-3">
                    Detail Product
                  </th>
                  <th scope="col" class="border border-slate-700 px-6 py-3">
                    Date
                  </th>
                  <th scope="col" class="border border-slate-700 px-6 py-3">
                    Status
                  </th>
                
                </tr>
              </thead>
              <tbody>
                {order.map((item, index) => {
                  return (
                    <tr
                      key={index}
                      class="bg-white  border-b dark:bg-gray-800  dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td class="w-4 p-4 border border-slate-700">
                        <div class="flex items-center">
                          <input
                            id="checkbox-table-search-1"
                            type="checkbox"
                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <label for="checkbox-table-search-1" class="sr-only">
                            checkbox
                          </label>
                        </div>
                      </td>
                      <td class="border border-slate-700    text-gray-900  dark:text-white">
                        <div>
                          <table class="overflow-auto w-[100%] text-sm text-left rtl:text-right  dark:text-white text-gray-500  ">
                            <thead className="text-xs text-gray-900  dark:text-white uppercase ">
                              <tr>
                                <th scope="col" class="px-6 py-3 ">
                                  Address
                                </th>
                                <th scope="col" class="px-6 py-3">
                                  Name
                                </th>
                                <th scope="col" class="px-6 py-3">
                                  Phone
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td class="px-6 py-4">
                                  {item.addressInfo.address}
                                </td>
                                <td class="px-6 py-4">
                                  {item.addressInfo.name}
                                </td>
                                <td class="px-6 py-4">
                                  {item.addressInfo.phoneNumber}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </td>

                      <td class="border border-slate-700    text-gray-900  dark:text-white">
                        <div class=" overflow-x-auto">
                          <table class=" overflow-auto w-[100%] text-sm text-left rtl:text-right">
                            <thead class="text-xs">
                              <tr>
                                <th scope="col" class="px-6 py-3">
                                  Product Name
                                </th>
                                <th scope="col" class="px-6 py-3">
                                  Price
                                </th>
                                <th scope="col" class="px-6 py-3">
                                  Product Number
                                </th>
                                
                                <th scope="col" class="px-6 py-3">
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {item.cartItems.map((product, index) => {
                                return (
                                  <tr key={index} class="">
                                    <th
                                      scope="row"
                                      class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                    >
                                      {product.title}
                                    </th>
                                    <td class="px-6 py-4">{product.price}$</td>
                                    <td class="px-6 py-4">
                                      {product.quantity}
                                    </td>
                                  
                                    <td class="px-6 py-4">
                                      <button
                                        onClick={() => {
                                          handlereview(item, product);
                                        }}
                                        type="button"
                                        class={`focus:outline-none ${
                                          item?.status === "completed" && !product.reviewed
                                            ? "text-white bg-yellow-400 hover:bg-yellow-500" : (product.reviewed)? "text-white bg-green-700 hover:bg-green-800"
                                            : " bg-slate-200 text-black"
                                        } focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-2 py-1  dark:focus:ring-yellow-900`}
                                      >
                                        Reviews
                                      </button>
                                      {/* { text-white bg-green-700 hover:bg-green-800} */}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </td>

                      <td class="px-6 py-4  border border-slate-700">
                        <div class="flex items-center">{item.date}</div>
                      </td>
                      <td class="px-6 py-4  border border-slate-700">
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
                      </td>

                  
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <h2 className=" text-center tex-2xl text-white">Not Order</h2>
      )}
    </Layout>
  );
}

export default Order;
