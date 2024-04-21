import React, { useContext, useEffect, useState } from "react";
import myContext from "../../../../context/data/myContext";
import { Link, useNavigate } from "react-router-dom";
import CustomInput from "./CustomInput";
import CustomInputImage from "./CustomInputImage";
import CustomTextarea from "./CustomTextarea";
import CustomSelect from "./CustomSelect";
import { advancedSchema } from "./schemas";
import { Form, Formik } from "formik";
import Loader from "../../../../components/loader/Loader";
import { FaRegPlusSquare } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { HiOutlineRefresh } from "react-icons/hi";
import {
  ref,
  uploadBytes,
  getStorage,
  listAll,
  getDownloadURL,
} from "firebase/storage";
import uuid from "react-uuid";
import { storage } from "../../../../fireabase/FirebaseConfig";

function AddProduct() {
  const context = useContext(myContext);
  const {
    products,
    setProducts,
    addProduct,
    get_OneProductData,
    updateProduct,
    categorys,
    getCategorysData,
    setLoading,
    loading,
  } = context;
  const navigate = useNavigate();
  const Link_dashbroad = () => {
    navigate("/dashboard/productdetail");
  };

  // useEffect(() => {
  //   setProducts({ ...products, category: categorys[0]?.id });
  // }, [categorys]);

  useEffect(() => {
    getCategorysData();
  }, []);
  const handleAddproduct = async (products) => {
    const respon = await addProduct(products);
    if (respon) {
      Link_dashbroad();
    }
  };

  const [size, setSize] = useState("")
  const [color, setColor] = useState("")
  const onSubmit = async (values, actions) => {
    try {
      setLoading(true);
      const arr_url = [];
      console.log(values);
      for (const image of values.imageUrl) {
        const imaRef = ref(storage, `categorys/${uuid()}`);
        const spaceRef = await uploadBytes(imaRef, image);
        const url = await getDownloadURL(spaceRef.ref);
        arr_url.push(url);
      }


      
      const products = { ...values, imageUrl: arr_url };
      console.log(products);
      await handleAddproduct(products);
      // actions.resetForm();
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  return (
    <>
      {loading && <Loader />}
      <div className=" relative  mt-5 flex items-center   justify-center  h-full">
        <Formik
          initialValues={{
            size: ["S", "M", "L", "XL", "2XL"],
            color: ["Black", "White", "Blue", "Dark"],
            title: "test product",
            price: 20,
            inventory_quantity: 30,
            imageUrl: "",
            category: "",
            description:
              "For instance, I had a problem because the index.html file pointed to and that's is correct if we release the application in the root folder, but if you have various static developments in the same machine using the same Apache Server you have a problem.",
          }}
          validationSchema={advancedSchema}
          enableReinitialize={true}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, values, errors, setFieldValue }) => (
            <Form className=" w-full md:container p-3">
              <div className=" grid sm:grid-cols-2 grid-cols-1  gap-4   w-full ">
                <CustomInput
                  label="Title"
                  name="title"
                  type="text"
                  placeholder="Enter title"
                />
                <CustomInput
                  label="Price"
                  name="price"
                  type="text"
                  placeholder="Enter price"
                />

                <CustomInput
                  label="Inventory Quantity"
                  name="inventory_quantity"
                  type="text"
                  placeholder="Enter Inventory Quantity"
                />
                <CustomSelect
                  label="Category"
                  name="category"
                  placeholder="Please select a category"
                  // value={categorys[0]?.id}

                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value=""></option>
                  {categorys.map((item, index) => {
                    return (
                      <option key={index} value={item.id}>
                        {item.title}
                      </option>
                    );
                  })}
                </CustomSelect>

               <div className="flex flex-col">
                <div className="mb-3 font-bold"> Size</div>
               <div className="flex  flex-wrap items-center gap-2  relative">
                  <div class=" rounded-md shadow-sm flex flex-wrap  "  role="group">
                    {values?.size?.map((item, index) => {
                      return (
                        <div key={index} className=" group relative">
                          <button
                            type="button"
                            class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
                          >
                            {item}
                          </button>
                          <button
                            onClick={() => {
                              const filterSize = values.size.filter((s, i) => {
                                return index != i;
                              });
                              return setFieldValue("size", filterSize);
                            }}
                            type="button"
                            class=" group-hover:flex hidden absolute  top-0 right-0 w-full  h-full  bg-slate-50 rounded-md p-1  items-center justify-center text-gray-400 hover:text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                          >
                            <IoMdClose size={20} />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className=" group">
                    <button
                      type="button"
                      class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    >
                      <FaRegPlusSquare size={20} />
                    </button>
                    <div className="group-hover:flex hidden absolute  bg-white gap-2  top-0 right-0 w-full">
                      <input
                      value={size}
                        onChange={(e) => {
                          setSize(e.target.value);
                        }}
                        type="text"
                        class="  z-10  h-full  w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="size"
                      />
                      <div>
                        {" "}
                        <button onClick={()=>{
                            if(size){
                              setFieldValue("size",[...values?.size, size]);
                            }
                            return setSize("")
                        }} type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2.5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Add</button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      return setFieldValue("size", [
                        "S",
                        "M",
                        "L",
                        "XL",
                        "2XL",
                      ]);
                    }}
                    type="button"
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                  >
                    <HiOutlineRefresh size={20} />
                  </button>
                </div>
               </div>

<div className="flex flex-col">
<div className="mb-2 font-bold">Color</div>

                <div className="flex  flex-wrap items-center gap-2  relative">

                 
                  <div class=" rounded-md shadow-sm flex flex-wrap  "  role="group">
                    {values?.color?.map((item, index) => {
                      return (
                        <div key={index} className=" group relative">
                          <button
                            type="button"
                            class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
                          >
                            {item}
                          </button>
                          <button
                            onClick={() => {
                              const filterSize = values?.color?.filter((s, i) => {
                                return index != i;
                              });
                              return setFieldValue("color", filterSize);
                            }}
                            type="button"
                            class=" group-hover:flex hidden absolute  top-0 right-0 w-full  h-full  bg-slate-50 rounded-md p-1  items-center justify-center text-gray-400 hover:text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                          >
                            <IoMdClose size={20} />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className=" group">
                    
                    <button
                      type="button"
                      class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    >
                      <FaRegPlusSquare size={20} />
                    </button>
                    <div className="group-hover:flex hidden absolute  bg-white gap-2  top-0 right-0 w-full">
                      <input
                      value={color}
                        onChange={(e) => {
                          setColor(e.target.value);
                        }}
                        type="text"
                        class="  z-10  h-full  w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="size"
                      />
                      <div>
                        {" "}
                        <button onClick={()=>{
                            if(color){
                              setFieldValue("color",[...values?.color, color]);
                            }
                            return setColor("")
                        }} type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2.5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Add</button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      return setFieldValue("color", ["Black", "White", "Blue", "Dark"]);
                    }}
                    type="button"
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                  >
                    <HiOutlineRefresh size={20} />
                  </button>
                </div>

                </div>

                <CustomTextarea
                  label="Description"
                  type="text"
                  cols="20"
                  rows="7"
                  name="description"
                  placeholder="Enter description"
                />

                {/* <div>
                  <CustomInput
                    label="imageurl"
                    name="imageUrl"
                    type="text"
                    placeholder="Enter imageurl"
                  />
                  <div className="mt-3 sm:max-w-[200px] w-[110px] h-[80px]  sm:max-h-[50px]">
                    <img src={values.imageUrl} alt="" srcset="" />
                  </div>
                </div> */}

                <div>
                  <CustomInputImage
                    label="Imageurl"
                    name="imageUrl"
                    type="file"
                    multiple="true"
                    placeholder="Enter imageurl"
                    accept="image/*"

                    // onChange={(event) => {
                    //   // const files = event.target.files;
                    //   //  let myFiles =Array.from(files);
                    //    setFieldValue("imageUrl1", "test");
                    // // console.log(myFiles)
                    // }}
                    //   onChange={(event) => {
                    //     setFieldValue("imageUrl1", event.currentTarget.files)
                    // errors?.imageUrl[index] ?
                    // }}
                  />

                  <div className="mt-3 mb-5   flex gap-5 sm:gap-4 w-ful flex-wrap">
                    {values?.imageUrl?.length != 0 &&
                      values?.imageUrl?.map((image, index) => {
                        return (
                          <div
                            data-aos="flip-up"
                            ease-out
                            data-aos-once="true"
                            className="relative group   "
                          >
                            <img
                              className={`" ${
                                errors?.imageUrl && errors?.imageUrl[index]
                                  ? " border-2 border-red-500"
                                  : "border-2 border-green-500"
                              } h-[220px] w-[220px]  "  `}
                              src={URL.createObjectURL(image)}
                              alt="none"
                              srcset=""
                            />

                            <button
                              onClick={() => {
                                const filterImage = values?.imageUrl.filter(
                                  (image, index_local) => {
                                    return index != index_local;
                                  }
                                );
                                console.log(index);
                                console.log(filterImage);
                                return setFieldValue("imageUrl", filterImage);
                              }}
                              type="button"
                              class=" group-hover:inline-block hidden absolute -top-2 -right-2  bg-slate-50 rounded-md p-1  items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                            >
                              <span class="sr-only">Close menu</span>

                              <svg
                                class="h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        );
                      })}
                    {values.imageUrl && values.imageUrl.name}
                  </div>
                </div>
              </div>

              <div className=" w-full gap-2  flex items-center my-3 ">
                <button
                  onClick={Link_dashbroad}
                  className="  bg-primary/40 hover:bg-primary w-[90px] font-bold  px-2 py-2 rounded-lg"
                >
                  Go back
                </button>

                <button
                  className="w-[150px]   bg-primary/40 hover:bg-primary font-bold  px-2 py-2 rounded-lg"
                  disabled={isSubmitting}
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}

export default AddProduct;
