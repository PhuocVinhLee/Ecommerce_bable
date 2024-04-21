import React, { useContext, useEffect, useState } from "react";
import myContext from "../../context/data/myContext";
import Layout from "../../components/layout/Layout";
import Modal from "../../components/modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import { deleteFromCart, addToCart, refreshCart } from "../../redux/cartSlice";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { addDoc, collection } from "firebase/firestore";
import { fireDB } from "../../fireabase/FirebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";

import { toast } from "react-toastify";
import { Array } from "core-js";

import PaypalCheckoutBuuton from "../../components/paypal/PaypalCheckoutBuuton";
import axios from "axios";



function Cart() {
  const navigate = useNavigate();
  const product = {
    desprition: "test 111111111",
    price: 20,
  };
  const [addressInfoAndPay, setAddressInfoAndPay] = useState("");
  const callAPIProvince = async () => {
    const reponse = await axios({
      method: "get",
      url: "https://vapi.vnappmob.com/api/province/",
    });
    console.log(reponse.data);
    setProvince(reponse.data);
  };

  const callAPIDistrict = async (province_id) => {
    console.log(province_id);
    try {
      const reponse = await axios({
        method: "get",
        url: `https://vapi.vnappmob.com/api/province/district/${province_id}`,
      });
      console.log(reponse.data);
      setDistrict(reponse.data);
    } catch (error) {
      console.log(error);
    }
  };

  const callAPIWard = async (district_id) => {
    try {
      if (district_id) {
        const reponse = await axios({
          method: "get",
          url: `https://vapi.vnappmob.com/api/province/ward/${district_id}`,
        });

        if (reponse?.data) {
          setWard(reponse.data);
        } else {
          setWard("");
        }
      } else {
        setWard("");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [province, setProvince] = useState([]);
  const [district, setDistrict] = useState([]);
  const [ward, setWard] = useState([]);
  const [address, setAddress] = useState({
    province: "",
    district: "",
    ward: "",
  });


  const [paidFor, setPaidFor] = useState(false); 
  const handleApprove = (order) => {
    // Call backend function to fulfill order

    // if response is success
    console.log(order)
  
   
      setPaidFor(order);
  
    
    // Refresh user's account or subscription status

  };
  const onSubmit = async (values, actions) => {
    try {

      setLoading(true);
      console.log(province)
      const province_local = await province?.results?.find((province)=>{
        return province?.province_id === values?.province
      })
      const district_local = await district?.results?.find((district)=>{
        return district?.district_id === values?.district
      })
      const ward_local = await  ward?.results?.find((ward)=>{
        return ward?.ward_id === values?.ward
      })
      console.log(values)

      
  
      if(values.pay ==="delivery"){
        order({...values, province: province_local?.province_name, district: district_local?.district_name, ward: ward_local?.ward_name});
      } if(values.pay =='paypal'){
        order({...values,paidFor,  province: province_local?.province_name, district: district_local?.district_name, ward: ward_local?.ward_name});
      }
  
 setLoading(false);
      
      // actions.resetForm();
    } catch (error) {
      console.log(error);
      setLoading(false);
    }

    setLoading(false);
  };







  
  const context = useContext(myContext);
  const {
    mode,
    user_infor,
    find_user_from_db,
    user_from_db,
    update_user_from_db,setLoading,loading
  } = context;

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => {
    // const cart = state.cart.toSorted((a, b) => {

    //   return -Number(b?.time) + Number(a?.time);
    // });
    // console.log(cart)
    return state.cart;
  });
  // console.log(cartItems)

  const [totalAmount, setTotalAmount] = useState(0);
  useEffect(() => {
    let temp = 0;
    cartItems.forEach((cartItem) => {
      temp = temp + parseInt(cartItem.price) * parseInt(cartItem.quantity);
    });
    setTotalAmount(temp);
    setGrandTotal(temp + shipping)
  }, [cartItems]);

  const shipping = parseInt(100);
  //const grandTotal = shipping + totalAmount;
  const [grandTotal, setGrandTotal] = useState(0);



  useEffect(() => {
    if (user_infor?.uid) {
      find_user_from_db(user_infor?.uid);
    }
  }, []);


  const order = async (addressInfoAndPay) => {
  
    setLoading(true)
const {pay, ...addressInfo} = addressInfoAndPay;
console.log(pay)
    const orderInfo = {
      uid: user_from_db?.id,
      pay: pay,
      cartItems,
      addressInfo,  
      date: new Date().toLocaleString(),
      status: "pending",
      total_order: grandTotal
     

    };


    try {
      const result = await addDoc(collection(fireDB, "orders"), orderInfo);
      toast.success(" You have placed your order successfully");
      dispatch(refreshCart());
      setLoading(false)
      navigate("/order");

    } catch (error) {
      console.log(error);
      setLoading(false)
      toast(" Some thing went wrong !");
    }
  };

  const buyNow = async () => {
  


    const addressInfo = {
     
      date: new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };
    console.log(addressInfo);

    // var options = {
    //   key: "", //key pay
    //   key_secret: "",
    //   amount: parseInt(grandTotal * 100),
    //   currency: "INR",
    //   order_receipt: "order_rcptid_" + name,
    //   name: "E-Bharat",
    //   description: "for testing purpose",
    //   handler: function (response) {
    //     // console.log(response)
    //     toast.success("Payment Successful");

    //     const paymentId = response.razorpay_payment_id;
    //     // store in firebase
    //     const orderInfo = {
    //       cartItems,
    //       addressInfo,
    //       date: new Date().toLocaleString("en-US", {
    //         month: "short",
    //         day: "2-digit",
    //         year: "numeric",
    //       }),
    //       email: JSON.parse(localStorage.getItem("user")).user.email,
    //       userid: JSON.parse(localStorage.getItem("user")).user.uid,
    //       paymentId,
    //     };

    //     try {
    //       const result = addDoc(collection(fireDB, "orders"), orderInfo);
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   },

    //   theme: {
    //     color: "#3399cc",
    //   },
    // };

    // var pay = new window.Razorpay(options);
    // pay.open();
    // console.log(pay);
  };

  // add to cart

  const addCart = (product) => {
    dispatch(addToCart(product));

    //toast.success("add to cart");
  };

  // const addCart = (product, productNumber) => {
  //   dispatch(addToCart({ product, productNumber}));
  //   toast.success("add to cart");
  // };
  const deleteCart = (item) => {
    dispatch(deleteFromCart(item));
    toast.success("delete g cart");
  };

  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [handleProduct, setHandleProduct] = useState({});

  // const updateSizeAndColor = async () => {
  //   dispatch(deleteFromCart(handleProduct));
  //   addCart({ ...handleProduct, size, color });
  // };
  useEffect(() => {
    console.log(size);
    console.log(color);

    if (size) {
      dispatch(deleteFromCart(handleProduct));
      addCart({ ...handleProduct, size });
      setSize();
      setColor();
    } else if (color) {
      dispatch(deleteFromCart(handleProduct));
      addCart({ ...handleProduct, color });
      setSize();
      setColor();
    }
  }, [size, color]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
    cartItems.forEach((item) => {
      if (item.productNumber == 0) {
        deleteCart(item);
      }
    });
  }, [cartItems]);

  return (
    <Layout>
       {loading && <Loader />}
      {Array.isArray(cartItems) && cartItems[0] ? (
        <div className=" md:max-h-[1000px]   pt-5  p-5">
          <h1 className="   mb-10 text-center text-2xl font-bold">
            Cart Items
          </h1>
          <div className="  mx-auto  w-full justify-center px-6 md:flex md:space-x-6 xl:px-0  ">
            <div className=" md:max-h-[900px]  overflow-auto rounded-lg md:w-2/3 ">
              <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table class=" shadow-md border rounded-lg w-full text-sm text-left rtl:text-right text-gray-500  bg-white dark:text-gray-400">
                  <thead class="text-xs text-gray-700 uppercase bg-white border-b dark:bg-gray-700 dark:text-white">
                    <tr>
                      <th scope="col" class="px-16 py-3">
                        <span class="sr-only">Image</span>
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Product
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Qty
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Color
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Size
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Price
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems
                      .toSorted((a, b) => {
                        return a?.title
                          ?.toLowerCase()
                          .localeCompare(b?.title?.toLowerCase());
                      })
                      .map((item, index) => {
                        return (
                          <tr
                            key={index}
                            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                          >
                            <td class="p-4">
                              <img src={item.imageUrl} />
                            </td>
                            <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                              {item.title}
                            </td>
                            <td class="px-6 py-4">
                              <div class="flex items-center">
                                <button
                                  onClick={() => {
                                    if (item?.quantity - 1 >= 1) {
                                      addCart({ ...item, quantity: -1 });
                                    }
                                  }}
                                  class="inline-flex items-center justify-center p-1 me-3 text-sm font-medium h-6 w-6 text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                                  type="button"
                                >
                                  <span class="sr-only">Quantity button</span>
                                  <svg
                                    class="w-3 h-3"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 18 2"
                                  >
                                    <path
                                      stroke="currentColor"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M1 1h16"
                                    />
                                  </svg>
                                </button>
                                <div>
                                  <input
                                    value={item?.quantity}
                                    type="number"
                                    id="first_product"
                                    class="bg-gray-50 w-14 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                  />
                                </div>
                                <button
                                  onClick={() => {
                                    if (
                                      item?.quantity + 1 <=
                                      item?.inventory_quantity
                                    ) {
                                      addCart({ ...item, quantity: 1 });
                                    }
                                  }}
                                  class="inline-flex items-center justify-center h-6 w-6 p-1 ms-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                                  type="button"
                                >
                                  <span class="sr-only">Quantity button</span>
                                  <svg
                                    class="w-3 h-3"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 18 18"
                                  >
                                    <path
                                      stroke="currentColor"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M9 1v16M1 9h16"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </td>
                            <td class="py-4 mx-2font-semibold text-gray-900 dark:text-white">
                              <select
                                id="countries"
                                class="  bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                onChange={(e) => {
                                  setColor(e.target.value);
                                  setHandleProduct(item);
                                }}
                                value={item?.color}
                              >
                                {item?.color_product?.map((color, index) => {
                                  return (
                                    <option
                                      // selected={color == item?.color}
                                      key={index}
                                      value={color}
                                    >
                                      {color}
                                    </option>
                                  );
                                })}
                              </select>
                            </td>
                            <td class="py-4 mx-2  font-semibold text-gray-900 dark:text-white">
                              <select
                                onChange={(e) => {
                                  setSize(e.target.value);
                                  setHandleProduct(item);
                                }}
                                value={item?.size}
                                id="countries"
                                class="  bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              >
                                {item?.size_product?.map((size, index) => {
                                  return (
                                    <option
                                      selected={size == item?.size}
                                      key={index}
                                      value={size}
                                    >
                                      {size}
                                    </option>
                                  );
                                })}
                              </select>
                            </td>
                            <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                              ${item.price}
                            </td>
                            <td
                              onClick={() => deleteCart(item)}
                              class="px-6 py-4"
                            >
                              <a
                                href="#"
                                class="font-medium text-red-600 dark:text-red-500 hover:underline"
                              >
                                Remove
                              </a>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 h-full rounded-lg border dark:text-white p-6 shadow-md md:mt-0 md:w-1/3">
              <div className="mb-2 flex justify-between">
                <p>Subtotal</p>
                <p>${totalAmount}</p>
              </div>
              <div className="flex justify-between">
                <p>Shipping</p>
                <p
                  className="text-gray-700"
                  style={{ color: mode === "dark" ? "white" : "" }}
                >
                  ${shipping}
                </p>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between mb-3">
                <p
                  className="text-lg font-bold"
                  style={{ color: mode === "dark" ? "white" : "" }}
                >
                  Total
                </p>
                <div className>
                  <p
                    className="mb-1 text-lg font-bold"
                    style={{ color: mode === "dark" ? "white" : "" }}
                  >
                    ${grandTotal}
                  </p>
                </div>
              </div>
              {/* // Props passing */}
              <Modal
               callAPIProvince= {callAPIProvince}
               handleApprove= {handleApprove}
               paidFor={paidFor}
               callAPIDistrict={callAPIDistrict}
               callAPIWard={callAPIWard}
               province={province}
               setProvince={setProvince}
               district={district}
               setDistrict={setDistrict}
               ward={ward}
               setWard={setWard}
               address={address}
               setAddress={setAddress}
               onSubmit= {onSubmit}
               grandTotal={grandTotal}
                buyNow={buyNow}
                order={order}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[500px] w-full  flex items-center justify-center mt-5 font-bold">
          Not cart
        </div>
      )}
    </Layout>
  );
}

export default Cart;
