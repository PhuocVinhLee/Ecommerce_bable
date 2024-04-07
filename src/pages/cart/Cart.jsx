import React, { useContext, useEffect, useState } from "react";
import myContext from "../../context/data/myContext";
import Layout from "../../components/layout/Layout";
import Modal from "../../components/modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import { deleteFromCart, addToCart , refreshCart} from "../../redux/cartSlice";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { addDoc, collection } from "firebase/firestore";
import { fireDB } from "../../fireabase/FirebaseConfig";

import { toast } from "react-toastify";

function Cart() {
  const context = useContext(myContext);
  const {
    mode,
    user_infor,
    find_user_from_db,
    user_from_db,
    update_user_from_db,
  } = context;

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart);
  // console.log(cartItems)

  const [totalAmount, setTotalAmount] = useState(0);
  useEffect(() => {
    let temp = 0;
    cartItems.forEach((cartItem) => {
      temp = temp + parseInt(cartItem.price) * parseInt(cartItem.productNumber);
    });
    setTotalAmount(temp);
    // console.log(temp)
  }, [cartItems]);

  const shipping = parseInt(100);
  const grandTotal = shipping + totalAmount;

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {

   if(user_infor?.uid){
    find_user_from_db(user_infor?.uid);
   }
  }, []);
  // useEffect(() => {
  //   console.log(user_from_db)
  //   setName(user_from_db?.name);
  //   setAddress(user_from_db?.address);
  //   setPhoneNumber(user_from_db?.phoneNumber);
  // }, [user_from_db]);

  const order = async () => {
    // await update_user_from_db({...user_from_db, name, address, phoneNumber})
    const addressInfo = {
      name,
      address,
      pincode,
      phoneNumber,
      date: new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };
   
    const orderInfo = {
      uid: user_from_db?.id,
      // name: user_from_db?.name,
      // emal: user_from_db?.emal,
      cartItems,
      addressInfo,
      date: new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      status: "pending"
      // email: JSON.parse(localStorage.getItem("user")).user.email,
      // userid: JSON.parse(localStorage.getItem("user")).user.uid,
    };

    try {
      const result = await addDoc(collection(fireDB, "orders"), orderInfo);
      toast.success(" You have placed your order successfully");
    dispatch(refreshCart());
    } catch (error) {
      console.log(error);
    }
  };
  const buyNow = async () => {
    // validation
    if (name === "" || address == "" || pincode == "" || phoneNumber == "") {
      return toast.error("All fields are required", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }

    const addressInfo = {
      name,
      address,
      pincode,
      phoneNumber,
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
  const addCart = (product, number) => {
    dispatch(addToCart({ product, productNumber: number }));
    // toast.success("add to cart");
  };

  // const addCart = (product, productNumber) => {
  //   dispatch(addToCart({ product, productNumber}));
  //   toast.success("add to cart");
  // };
  const deleteCart = (item) => {
    dispatch(deleteFromCart(item));
    toast.success("delete g cart");
  };

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
      <div
        className=" max-h-[700px]   pt-5 "
       
      >
        <h1 className="   mb-10 text-center text-2xl font-bold">Cart Items</h1>
        <div className="  mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0 ">
          <div className=" max-h-[500px]  overflow-auto rounded-lg md:w-2/3 ">
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
                                onClick={() => addCart(item, -1)}
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
                                  value={item.productNumber}
                                  type="number"
                                  id="first_product"
                                  class="bg-gray-50 w-14 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  required
                                />
                              </div>
                              <button
                                onClick={() => addCart(item, 1)}
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

          <div
            className="mt-6 h-full rounded-lg border dark:text-white p-6 shadow-md md:mt-0 md:w-1/3"
            
          >
            <div className="mb-2 flex justify-between">
              <p
               
              >
                Subtotal
              </p>
              <p
               
              >
                ₹{totalAmount}
              </p>
            </div>
            <div className="flex justify-between">
              <p
                
              >
                Shipping
              </p>
              <p
                className="text-gray-700"
                style={{ color: mode === "dark" ? "white" : "" }}
              >
                ₹{shipping}
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
                  ₹{grandTotal}
                </p>
              </div>
            </div>
            {/* // Props passing */}
            <Modal
              name={name}
              address={address}
              pincode={pincode}
              phoneNumber={phoneNumber}
              setName={setName}
              setAddress={setAddress}
              setPincode={setPincode}
              setPhoneNumber={setPhoneNumber}
              buyNow={buyNow}
              order={order}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Cart;
