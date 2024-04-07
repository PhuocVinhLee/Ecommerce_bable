import React, { useContext, useEffect, useState } from "react";
import myContext from "../../../../context/data/myContext";
import Layout from "../../../../components/layout/Layout";
import Loader from "../../../../components/loader/Loader";
import SplitPane, { Pane } from "react-split-pane";
import { GoTriangleDown } from "react-icons/go";

function Order() {
  // const userid = JSON.parse(localStorage.getItem('currentUser'))?.user.uid
  const context = useContext(myContext);
  const {
    mode,
    loading,
    orders,
    getOrderData,
    user_infor,
    upDateOrderFromAdmin,
    update_inventoryAndSelling_Product,
    setProducts,
    get_OneProductData,
  } = context;

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
console.log(product)
   const  data_update ={
        id: product.id,
        inventory_quantity:
          product_local.inventory_quantity - product.productNumber,
        selling_strategy:
          product_local.selling_strategy + product.productNumber,
      };
       await update_inventoryAndSelling_Product(data_update);
    });
   } catch (error) {
    console.log(error)
   }
  };
  useEffect(() => {
   if(orderLocal?.id){
    upDateOrderFromAdmin(orderLocal?.id, { status: statusOrder });
    if(statusOrder == "completed"){
      update_inventoryAndSelling();
    }
   }
  }, [statusOrder]);
  return (
    <div>
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
      {orders.length > 0 ? (
        <>
          <div className=" p-2 rounded-sm   overflow-auto h-full w-[100%] pt-10">
            <table class="  border-collapse w-full  border-slate-500 relative border   overflow-auto  p-3 text-sm text-left rtl:text-right text-gray-500  dark:text-white">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700  dark:text-white">
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
                {orders.map((item, index) => {
                  return (
                    <tr
                      key={index}
                      class="bg-white  border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
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
                          <table class="overflow-auto w-[100%] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 ">
                            <thead className="text-xs text-gray-900 uppercase  dark:text-white  ">
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
                                  {item.addressInfo?.address}
                                </td>
                                <td class="px-6 py-4">
                                  {item.addressInfo?.name}
                                </td>
                                <td class="px-6 py-4">
                                  {item.addressInfo?.phoneNumber}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </td>

                      <td class="border border-slate-700">
                        <div class=" overflow-x-auto">
                          <table class=" overflow-auto w-[100%] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead class="text-xs text-gray-900  uppercase  dark:text-white">
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
                                  Description
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {item.cartItems.map((item, index) => {
                                return (
                                  <tr key={index} class=" ">
                                    <th
                                      scope="row"
                                      class="px-6 py-4 font-medium whitespace-nowrap"
                                    >
                                      {item?.title}
                                    </th>
                                    <td class="px-6 py-4">{item.price}</td>
                                    <td class="px-6 py-4">
                                      {item?.productNumber}
                                    </td>
                                    <td class="px-6 py-4">
                                      {item?.description}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </td>

                      <td class="px-6 py-4  border border-slate-700">
                        <div class="flex items-center">{item?.date}</div>
                      </td>

                      <td class="px-6 py-4  border border-slate-700">
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
    </div>
  );
}

export default Order;
