import React, { useContext, useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import myContext from "../../../../context/data/myContext";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { FaUser, FaCartPlus } from "react-icons/fa";
import { BiCategory } from "react-icons/bi";
import { AiFillShopping, AiFillPlusCircle, AiFillDelete } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../../../components/loader/Loader";


import {
  ref,
  uploadBytes,
  getStorage,
  listAll,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../../../../fireabase/FirebaseConfig";
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
    loading,
    order,
    setLoading,
    user,
  } = context;
  const add = () => {
    //window.location.href = "/addproduct";
    navigate("/addproduct");
  };

  const deleteP = async () => {
    try {
      setModal(false)
      setPassword("");
      const passwordLocal = "areyouadmin";
      if (password != passwordLocal) {
        setErorPassword("Password not math!")
        return;
      }

      setLoading(true);
      for (const urlimage of item.imageUrl) {
        var arrStr = urlimage.split(/[/?]/);

        const [folder, , nameImg] = arrStr[7].split(/[%F]/);

        const desertRef = ref(storage, `${folder + "/" + nameImg}`);
        await deleteObject(desertRef);
      }

      await deleteProduct(item);
      setLoading(false)
    } catch (error) {
      setLoading(false);
    }
  };
  const handleDeleteProduct = async (item) => {
    setModal(true);
    setItem(item);

  };
  useEffect(() => {
    getProductData();
    
  }, []);

  const [modal, setModal] = useState(false);
  const [password, setPassword] = useState("");
  const [erorPassword, setErorPassword] = useState("");
  const [item, setItem] = useState("");
  return (
    <>
   {loading && <Loader />}
    <div>
      {modal && (
        <div
          tabindex="-1"
          class=" border bg-black/20 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 bottom-0 flex justify-center items-center w-full md:inset-0  z-[100] h-full"
        >
          <div class="relative p-4 w-full max-w-md max-h-full ">
            <div
              data-aos="flip-up"
              ease-out
              data-aos-once="true" 
              class="relative bg-white rounded-lg shadow dark:bg-gray-700"
            >
              <button
                onClick={() => {
                  setErorPassword("")
                  setPassword("")
                  return setModal(false);
                }}
                type="button"
                class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="popup-modal"
              >
                <svg
                  class="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span class="sr-only">Close modal</span>
              </button>
              <div class="p-4 md:p-5 text-center">
                <svg
                  class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete this product?
                </h3>
                <div className="flex justify-start flex-col w-full gap-2 ">
                  <h4>Please enter your password</h4>
                  <form class="max-w-sm mx-auto mb-3 w-full">
                    <input
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                      type="text"
                      aria-describedby="helper-text-explanation"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="password"
                      required
                    />
                    {erorPassword && (< div className=" text-red-500"> {erorPassword}
                    </div>)}
                  </form>
                </div>
                <button  onClick={() => {
                     deleteP();
                  }}
                  type="button"
                  class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                >
                  Yes, I'm sure
                </button>
                <button
                  onClick={() => {
                    setErorPassword("")
                    setPassword("")
                    return setModal(false);
                  }}
                  type="button"
                  class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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

            <div
              id="dropdownAction"
              class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
            >
              <ul
                class="py-1 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownActionButton"
              >
                <li>
                  <a
                    href="#"
                    class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Reward
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Promote
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Activate account
                  </a>
                </li>
              </ul>
              <div class="py-1">
                <a
                  href="#"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                  Delete User
                </a>
              </div>
            </div>
          </div>
          <label for="table-search" class="sr-only">
            Search
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                class="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="table-search-users"
              class="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search for prodcuts"
            />
          </div>
        </div>
        <table class=" p-3 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr className=" dark:text-white">
              <th scope="col" class="p-4">
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
                Size
              </th>
              <th scope="col" class="px-6 py-3">
                Color
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
                size,
                color,
                category,
                description,
                inventory_quantity,
                selling_strategy,
                date,
                time
              } = item;
              return (
                <tr key={index} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td class="w-4 p-4">
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
                  <th
                    scope="row"
                    class="px-1 py-4 text-gray-900  dark:text-white"
                  >
                    <div class=" flex  flex-col justify-center  ps-3 max-w-[400px] ">
                      <div class=" font-semibold mb-3  max-w-[400px] ">{title}</div>
                      <div className="flex gap-3 flex-wrap">
                        {Array.isArray(imageUrl) &&
                          imageUrl?.map((img) => {
                            return <img class="w-20 h-20" src={img} />;
                          })}
                      </div>
                    </div>
                  </th>

{/* <td>{time.seconds}</td> */}
                  <td class="px-6 py-4">
                    <div class="flex items-center">{price}</div>
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
                    <div class="flex items-center">
                      <div
                        class=" rounded-md shadow-sm flex flex-wrap  "
                        role="group"
                      >
                        {size?.map((item, index) => {
                          return (
                            <div key={index} className="">
                              <button
                                type="button"
                                class="px-2 py-2 w-10 flex items-center justify-center text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
                              >
                                {item}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center">
                      <div
                        class=" rounded-md shadow-sm flex flex-wrap  "
                        role="group"
                      >
                        {color?.map((item, index) => {
                          return (
                            <div key={index} className=" group relative">
                              <button
                                type="button"
                                class="px-2.5 py-2 w-20 flex items-center justify-center text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
                              >
                                {item}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    {categorys.map((item, index) => {
                      return item?.id == category ? (
                        <div>{item?.title}</div>
                      ) : (
                        ""
                      );
                    })}
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center max-w-[150px]">
                      {description}
                    </div>
                  </td>
                  <td class="px-6 py-4 flex ">
                    <div
                      onClick={() => {
                        handleDeleteProduct(item);
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
              );
            })}
          </tbody>
        </table>
      </div>
      =
    </div>
    </>
  );
}

export default ProductDetail;
