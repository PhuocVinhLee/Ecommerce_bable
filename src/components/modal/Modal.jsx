import { Dialog, Transition } from "@headlessui/react";

import React, {
  Fragment,
  useEffect,
  useState,
  useContext,
  useRef,
} from "react";
import PaypalCheckoutBuuton from "../paypal/PaypalCheckoutBuuton";
import myContext from "../../context/data/myContext";
import CustomInput from "./CustomInput";
import CustomRadio from "./CustomRadio";

import { advancedSchema } from "./schemas";
import { Form, Formik } from "formik";

import axios from "axios";

export default function Modal({
  setAddressInfoAndPay,
  callAPIProvince,callAPIDistrict,callAPIWard,province,setProvince,
  district,setDistrict,ward,setWard,address,setAddress,onSubmit,handleApprove,paidFor,grandTotal,
  buyNow,
  order,
}) {

  const refFormmik = useRef(null);


  useEffect(() => {
    callAPIProvince();
  }, []);

  useEffect(() => {
    callAPIWard(address?.district);
  }, [address?.district, address?.province, district]);

  useEffect(() => {
    callAPIDistrict(address?.province);
    setAddress({ ...address, district: "", ward: "" });
  }, [address?.province]);

  const context = useContext(myContext);
  const { addCategory, loading, setLoading } = context;
  let [isOpen, setIsOpen] = useState(false);
  const [radioOrder, setRadioOrder] = useState("");

  function closeModal() {
    setRadioOrder("");
    setIsOpen(false);
  }

  function openModal() {
    setRadioOrder("");
    setIsOpen(true);
  }
  const [product, setproduct] = useState({
    desprition: "test 111111111",
    price: 20,
  });

 

  const handleAddCategory = async (values) => {
    // const respon = addCategory(values);  
    // if(respon){
    //    navigate("/dashboard/categorydetail")
    // }
  };
  return (
    <>
      <div className="  text-center  rounded-lg text-white font-bold">
        <button
          type="button"
          onClick={openModal}
          className="w-full  bg-violet-600 py-2 text-center rounded-lg text-white font-bold"
        >
          Buy Now
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10 " onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full container  transform overflow-hidden rounded-2xl p-2  text-left align-middle shadow-xl transition-all bg-gray-50">
                  <section className="">
                    <div className="flex  flex-col items-center justify-center  mx-auto  lg:py-0">
                      {/* <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                                                <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
                                                Flowbite
                                            </a> */}
                      <div className="w-full  rounded-lg md:mt-0  xl:p-0 ">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                          <Formik
                            innerRef={(f) => (refFormmik.current = f)}
                            initialValues={{
                              name: "David Ngo",
                              // address:
                              province: "",
                              district: "",
                              ward: "",

                              pincode: "987654321",
                              phoneNumber: "078863200",
                              pay: "",
                            }}
                            validationSchema={advancedSchema}
                            onSubmit={onSubmit}
                          >
                            {({ isSubmitting, values,errors, setFieldValue }) => (
                              <Form className=" w-full md:container p-3">
                                <div className="mb-3">{values.pay == 'paypal' ? ( <div>
                                  <div>Sandbox Accounts for Paypal</div>
                                  Usename: <span className=" font-bold">sb-hx38530454493@personal.example.com</span>, Pasword: <span className=" font-bold">K7&@V0yQ</span>
                                </div>): " "}</div>
                                <div className="    grid  grid-cols-1  gap-4   w-full ">
                                  <CustomInput
                                    label="Name"
                                    name="name"
                                    type="text"
                                    placeholder="Enter title"
                                  />
                                  <div>
                                    <div class=" mx-auto flex gap-2 w-full   justify-between">
                                      <div className="w-full">
                                        <label
                                          for="small"
                                          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                          Province
                                        </label>
                                        <select
                                          onChange={(e) => {
                                            setAddress({
                                              ...address,
                                              province: e.target.value,
                                            });
                                            setFieldValue("province", e.target.value )
                                          }}
                                          id="small"
                                          class="block w-full p-2  text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        >
                                          <option>Choose a province</option>
                                          {province?.results?.map((provinc) => {
                                            return (
                                              <option
                                                value={provinc.province_id}
                                              >
                                                {provinc?.province_name}
                                              </option>
                                            );
                                          })}
                                        </select>
                                        {errors?.province && <div className="text-red-500 text-xs italic">{errors?.province}</div>}
                                      </div>
                                      <div className="w-full">
                                        <label
                                          for="default"
                                          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                         District
                                        </label>
                                        <select
                                          onChange={(e) => {
                                            setAddress({
                                              ...address,
                                              district: e.target.value,
                                              
                                            });
                                            setFieldValue("district", e.target.value )
                                          }}
                                          id="default"
                                          class="bg-gray-50 border border-gray-300 text-gray-900  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        >
                                          <option>Choose a district</option>

                                          {district?.results?.map((distric) => {
                                            return (
                                              <option
                                                value={distric?.district_id}
                                              >
                                                {distric?.district_name}
                                              </option>
                                            );
                                          })}
                                        </select>
                                        {errors?.district && <div className="text-red-500 text-xs italic">{errors?.district}</div>}
                                      </div>
                                      <div className="w-full">
                                        <label
                                          for="default"
                                          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                          Ward
                                        </label>
                                        <select
                                         onChange={(e) => {
                                        
                                          setFieldValue("ward", e.target.value )
                                        }}
                                          id="default"
                                          class="bg-gray-50 border border-gray-300 text-gray-900  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        >
                                          <option>Choose a district</option>

                                          {ward?.results?.map((war) => {
                                            return (
                                              <option value={war?.ward_id}>
                                                {war?.ward_name}
                                              </option>
                                            );
                                          })}
                                        </select>
                                        {errors?.ward && <div className="text-red-500 text-xs italic">{errors?.ward}</div>}
                                      </div>
                                    </div>
                                  </div>
                                  <CustomInput
                                    label="Pincode"
                                    name="pincode"
                                    type="text"
                                    placeholder="Enter title"
                                  />
                                  <CustomInput
                                    label="PhoneNumber"
                                    name="phoneNumber"
                                    type="text"
                                    placeholder="Enter title"
                                  />

                                  <div className="flex w-full gap-2">
                                    <CustomRadio
                                      label="Payment on delivery"
                                      name="pay"
                                      value="delivery"
                                      type="radio"
                                      placeholder="Enter title"
                                    />
                                    <CustomRadio
                                      label="Pay with paypal"
                                      name="pay"
                                      value="paypal"
                                      type="radio"
                                      placeholder="Enter title"
                                    />
                                  </div>
                                </div>

                                <div className=" w-full gap-2  flex items-center my-3 ">
                                  {/* <button
                  onClick={Link_dashbroad}
                  className="  bg-primary/40 hover:bg-primary w-[90px] font-bold  px-2 py-2 rounded-lg"
                >
                  Go back
                </button> */}

                                  {/* <button
                                    className="w-[150px]   bg-primary/40 hover:bg-primary font-bold  px-2 py-2 rounded-lg"
                                    disabled={isSubmitting}
                                    type="submit"
                                  >
                                    Submit
                                  </button> */}
                                </div>

                                <div>
                                  {values.pay === "delivery"  ? (
                                    <div className="text-center w-ful">
                                      <button
                                        type="submit"
                                        className="focus:outline-none w-full text-center text-white bg-violet-600 hover:bg-violet-800  outline-0 font-medium rounded-lg text-sm px-5 py-2.5 "
                                      >
                                        Order Now
                                      </button>
                                    </div>
                                  ) : values.pay === "paypal" ? (
                                    <button className=" w-full ">
                                      
                                     <div  className="">
                                     <PaypalCheckoutBuuton 
                                        product={{price: grandTotal, description: "David Ngo buy product"}}
                                        handleApprove= {handleApprove}
                                      
                                      ></PaypalCheckoutBuuton>
                                     </div>
                                    </button>

                                  ) : (
                                    ""
                                  )}
                                </div>
                                {console.log(paidFor)}
                                {paidFor?.status =="COMPLETED" && (
                                   <div className="text-center w-ful">
                                   <button
                                     type="submit"
                                     className="focus:outline-none w-full text-center text-white bg-violet-600 hover:bg-violet-800  outline-0 font-medium rounded-lg text-sm px-5 py-2.5 "
                                   >
                                     Order Now
                                   </button>
                                 </div>
                                )}
                              </Form>
                            )}
                          </Formik>
                        </div>
                      </div>
                    </div>
                  </section>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
