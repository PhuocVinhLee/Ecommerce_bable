import React, { useContext, useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import myContext from "../../../../context/data/myContext";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { FaUser, FaCartPlus } from "react-icons/fa";
import { BiCategory } from "react-icons/bi";
import { AiFillShopping, AiFillPlusCircle, AiFillDelete } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
function ProductDetail() {
  const navigate = useNavigate();
  const context = useContext(myContext);
  const {
    mode,
    product,
    categorys,
    edithandle,
    updateProduct,
    deleteProduct,
    getProductData,
    order,
    user,
  } = context;
  const add = () => {
    //window.location.href = "/addproduct";
    navigate("/addproduct");
  };

  useEffect(()=>{
    getProductData()
  },[])

  return (
    <div>
      
      

<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <div class=" p-3 flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900">
        <div>
        <button
            onClick={add}
            type="button"
            className="focus:outline-noneborder  dark:text-white dark:bg-gray-800  dark:hover:bg-primary bg-primary/70 hover:bg-primary border  border-primary outline-0 font-medium rounded-lg text-sm px-5 py-2.5 "
            style={{
              backgroundColor: mode === "dark" ? "rgb(46 49 55)" : "",
              color: mode === "dark" ? "white" : "",
            }}
          >
            {" "}
            <div className="flex gap-2 items-center">
              Add Product <FaCartPlus size={20} />
            </div>
          </button>
           
            <div id="dropdownAction" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                <ul class="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownActionButton">
                    <li>
                        <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Reward</a>
                    </li>
                    <li>
                        <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Promote</a>
                    </li>
                    <li>
                        <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Activate account</a>
                    </li>
                </ul>
                <div class="py-1">
                    <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete User</a>
                </div>
            </div>
        </div>
        <label for="table-search" class="sr-only">Search</label>
        <div class="relative">
            <div class="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
            </div>
            <input type="text" id="table-search-users" class="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for prodcuts"/>
        </div>
    </div>
    <table class=" p-3 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr className=" dark:text-white">
                <th scope="col" class="p-4">
                    <div class="flex items-center">
                        <input id="checkbox-all-search" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                        <label for="checkbox-all-search" class="sr-only">checkbox</label>
                    </div>
                </th>
                <th scope="col" class="px-6 py-3">
                   Title
                </th>
                <th scope="col" class="px-6 py-3">
                   Price
                </th>
                <th scope="col" class="px-6 py-3">
                Inventory Quantity 
                </th>
                <th scope="col" class="px-6 py-3">
                Quantity Sold
                </th>
                <th scope="col" class="px-6 py-3">
                    Category
                </th>
                <th scope="col" class="px-6 py-3">
                Description
                </th>
                <th scope="col" class="px-6 py-3">
                    Action
                </th>
            </tr>
        </thead>
        <tbody>

        {product.map((item, index) => {
                const {
                  id,
                  title,
                  price,
                  imageUrl,
                  category,
                  description,
                  inventory_quantity,
                  selling_strategy,
                  date,
                } = item;
                return (
                  <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td class="w-4 p-4">
                      <div class="flex items-center">
                          <input id="checkbox-table-search-1" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                          <label for="checkbox-table-search-1" class="sr-only">checkbox</label>
                      </div>
                  </td>
                  <th scope="row" class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                      <img class="w-10 h-10" src={imageUrl}/>
                      <div class="ps-3">
                          <div class="text-base font-semibold">{title}</div>
                        
                      </div>  
                  </th>

                  <td class="px-6 py-4">
                      <div class="flex items-center">
                         {price}
                      </div>
                  </td>

                  <td class="px-6 py-4">
                      <div class="flex items-center">
                         {inventory_quantity ? inventory_quantity : " "}
                      </div>
                  </td>
                  <td class="px-6 py-4">
                      <div class="flex items-center">
                         {selling_strategy ? selling_strategy : 0}
                      </div>
                  </td>
                  
                  <td class="px-6 py-4">

                  {categorys.map((item, index) => {
                        return ((item?.id == category) ? <div>{item?.title}</div> : "");
                      })}
                      
                  </td>
                  <td class="px-6 py-4">
                      <div class="flex items-center">
                         {description}
                      </div>
                  </td>
                  <td class="px-6 py-4 flex ">
                  <div
                            onClick={() => {
                              deleteProduct(item);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              />
                            </svg>
                          </div>
                          <Link to={`/updateproduct/${id}`}>
                            <div
                            // onClick={() => {
                            //   edithandle(item);
                            // }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                />
                              </svg>
                            </div>
                          </Link>
                  </td>
              </tr>
               ) })}

         
           
        </tbody>
    </table>
</div>


=
    </div>
  );
}

export default ProductDetail;
