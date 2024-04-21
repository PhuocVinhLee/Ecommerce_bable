import React, { useContext, useEffect, useState, useMemo } from "react";
import Layout from "../../components/layout/Layout";
import myContext from "../../context/data/myContext";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { addToCart } from "../../redux/cartSlice";
import { fireDB } from "../../fireabase/FirebaseConfig";
// import { FaStar } from "react-icons/pi";
import { FaStar } from "react-icons/fa";
import { BiLike } from "react-icons/bi";
import { BiDislike } from "react-icons/bi";
import { comment } from "postcss";
import { Timestamp } from "firebase/firestore";
import { Link } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import ProgressBar from "@ramonak/react-progress-bar";

import Slider from "react-slick";

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "none" }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "none" }}
      onClick={onClick}
    />
  );
}
function Reviews() {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  const context = useContext(myContext);
  const {
    loading,
    setLoading,
    addReview,
    user_from_db,
    reviews,
    getReviewDate,
    upDateOrderFromAdmin,
    get_OneOrdertData,
  } = context;

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart);
  // console.log(cartItems)

  const caculater_start = () => {
    const arr_start = [0, 0, 0, 0, 0];
    reviews.forEach((review) => {
      if (review?.start_number == 1) {
        return (arr_start[0] = arr_start[0] + 1);
      } else if (review?.start_number == 2) {
        return (arr_start[1] = arr_start[1] + 1);
      } else if (review?.start_number == 3) {
        return (arr_start[2] = arr_start[2] + 1);
      } else if (review?.start_number == 4) {
        return (arr_start[3] = arr_start[3] + 1);
      } else if (review?.start_number == 5) {
        return (arr_start[4] = arr_start[4] + 1);
      }
    });

    return arr_start;
  };

  const arr_start = useMemo(() => {
    return caculater_start();
  }, [reviews]);
  // const addCart = (product) => {
  //   dispatch(addToCart({ product, productNumber: 1 }));
  //   toast.success("add to cart");
  // };

  const addCart = () => {
    if (color && size && quantity) {
      setModal(false);
      setSize("");
      setColor("");
      setQuantity(1);
      const product = {
        ...productHandle,
        color_product: productHandle.color,
        size_product: productHandle.size,
        color,
        size,
        quantity,
        time: Date.now(),
      };

      // console.log({...productCart, productNumber: 1})
      dispatch(addToCart(product));
      toast.success("add to cart");
    } else {
      return toast.error("Please choose size and color");
    }
  };
  const [modal, setModal] = useState(false);
  const [item, setItem] = useState("");
  const [productHandle, setProductHandle] = useState({});
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleAddCart = (product) => {
    setProductHandle(product);
    setModal(true);
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const start_Average = useMemo(() => {
    let caculater = 0;
    reviews.forEach((review) => {
      console.log(review)
      if(review?.start_number){
        caculater = caculater + Number(review?.start_number);
      }
    });
    if (!caculater / reviews?.length) {
      return 0;
    }
    return caculater / reviews?.length;
  }, [reviews]);

  const [products, setProducts] = useState("");
  const params = useParams();
  // console.log(products.title)

  const getProductData = async () => {
    setLoading(true);
    try {
      const productTemp = await getDoc(doc(fireDB, "products", params.id));
      // console.log(productTemp)
      setProducts(productTemp.data());
      console.log(productTemp.data());
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getProductData();
    getReviewDate(params.id);
  }, []);
  const [review, setReview] = useState({
    // id_product: null,
    // uid: null,
    start_number: 5,
    comment: "",
    imaUrlComemnt: "",
    // time: Timestamp.now(),
  });
  const handleAddreview = async () => {
    const review_local = {
      ...review,
      uid: user_from_db?.id,
      imaUrlUser: user_from_db?.imageURL,
      nameUser: user_from_db?.name,
      time: Timestamp.now(),
      idProduct: params?.id,
    };
    await addReview(review_local);
    const order = await get_OneOrdertData(params?.id_order);
    const cartItems = order?.cartItems.map((item) => {
      if (item?.id == params?.id) {
        return { ...item, reviewed: true };
      } else return item;
    });
    const order_local = {
      ...order,
      cartItems: cartItems,
    };
    await upDateOrderFromAdmin(params?.id_order, order_local);

    getProductData();
    getReviewDate(params.id);
    setshowAddReview(false);
  };
  const [showAddReview, setshowAddReview] = useState(false);
  useEffect(() => {
    console.log(review);
  }, [review]);
  return (
    <Layout>
      {loading && <Loader />}
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
                  setModal(false);
                  setSize("");
                  setQuantity(1);
                  return setColor("");
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
              <div class="p-4 md:p-5 flex flex-col">
                <div className="flex justify-start flex-col w-full gap-5 mb-3 ">
                  <div className="flex flex-row items-center gap-2">
                    <div className=" font-bold"> Size:</div>
                    <div className="flex  flex-wrap items-center gap-2  relative">
                      <div
                        class=" rounded-md shadow-sm flex flex-wrap  "
                        role="group"
                      >
                        {productHandle.size?.map((item, index) => {
                          return (
                            <div key={index} className=" flex  relative gap-2 ">
                              <button
                                onClick={() => {
                                  setSize(item);
                                }}
                                type="button"
                                className={`" px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700
                                 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700  "
                                ${
                                  item == size
                                    ? "  z-10 ring-2 ring-blue-700 text-blue-700  dark:ring-blue-500 dark:text-white"
                                    : " "
                                }    `}
                              >
                                {/* ${item == size ? " " : " "}  */}
                                {item}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row items-center gap-2">
                    <div className="mb-2 font-bold">Color:</div>

                    <div className="flex  flex-wrap items-center gap-2  relative">
                      <div
                        class=" rounded-md shadow-sm flex flex-wrap  "
                        role="group"
                      >
                        {productHandle?.color?.map((item, index) => {
                          return (
                            <div key={index} className=" flex gap-2 relative">
                              <button
                                onClick={() => {
                                  setColor(item);
                                }}
                                type="button"
                                className={`" px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700
                                 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700  "
                                ${
                                  item == color
                                    ? "  z-10 ring-2 ring-blue-700 text-blue-700  dark:ring-blue-500 dark:text-white"
                                    : " "
                                }    `}
                              >
                                {item}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row items-center gap-2 ">
                    <div className=" font-bold"> Inventory quantity:</div>
                    <div>
                      <span className="font-bold">
                        {productHandle?.inventory_quantity}
                      </span>{" "}
                      items
                    </div>
                  </div>
                  <div className="flex flex-row items-center gap-2 ">
                    <div className="font-bold">Quantity:</div>
                    <div class="flex items-center">
                      <button
                        onClick={() => {
                          if (quantity - 1 >= 1) {
                            setQuantity((value) => {
                              return value - 1;
                            });
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
                          value={quantity}
                          type="number"
                          id="first_product"
                          class="bg-gray-50 w-14 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                      </div>
                      <button
                        onClick={() => {
                          if (quantity + 1 > productHandle.inventory_quantity) {
                            return toast.error(
                              "Excess product quantity in stock"
                            );
                          }
                          return setQuantity((value) => value + 1);
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
                  </div>
                </div>

                <div className=" text-center">
                  <button
                    onClick={() => {
                      return addCart();
                    }}
                    type="button"
                    class=" m-0 py-2.5 px-5  text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    Add Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {products && (
        <div>
          {" "}
          <section className=" border-b-2">
            <div className="flex">
              <div className="w-1/3 flex flex-col justify-start p-3">
              <div className="mb-10">
              <Slider {...settings} className=" border  ">
                  {products?.imageUrl.map((img, index) => {
                    return (
                      <img
                        src={img}
                        alt=""
                        className="   bg-slate-400 mt-0 w-[400px] h-[400px] block mx-auto transform -translate-y-19 group-hover:scale-105 duration-300 drop-shadow-md"
                      />
                    );
                  })}
                </Slider>
              </div>

                {/* <img
                  className=" bg-slate-400 mt-0 w-[400px] h-[400px]"
                  src={products.imageUrl}
                  alt=""
                /> */}
                <div className="flex gap-1 ">
                  <div className="font-bold">Name:</div>
                  <div> {products.title}</div>
                </div>
                <div className="flex gap-1">
                  <div className="font-bold">Price:</div>
                  <div>{products.price}</div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="font-bold">Description:</div>
                  <div>{products.description}</div>
                </div>
              </div>
              <div className="w-2/3 flex flex-col  justify-center p-3">
                <div className="flex items-center gap-3 ">
                  {" "}
                  1 <FaStar size={20} className=" text-yellow-400" />
                  <div className="w-full flex items-center justify-center">
                    <div class=" w-full rounded-full">
                      <ProgressBar
                        customLabel={" "}
                        completed={parseFloat(
                          (arr_start[0] / reviews?.length) * 100
                            ? (arr_start[0] / reviews?.length) * 100
                            : 0
                        )}
                      />
                    </div>
                  </div>
                  {parseFloat(
                    (arr_start[0] / reviews?.length) * 100
                      ? (arr_start[0] / reviews?.length) * 100
                      : 0
                  ).toFixed(2) + "%"}
                </div>
                <div className="flex items-center gap-3 ">
                  {" "}
                  2 <FaStar size={20} className=" text-yellow-400" />
                  <div className="w-full flex items-center justify-center">
                    <div class=" w-full  rounded-full ">
                      <ProgressBar
                        customLabel={" "}
                        completed={parseFloat(
                          (arr_start[1] / reviews?.length) * 100
                            ? (arr_start[1] / reviews?.length) * 100
                            : 0
                        )}
                      />
                    </div>
                  </div>
                  {parseFloat(
                    (arr_start[1] / reviews?.length) * 100
                      ? (arr_start[1] / reviews?.length) * 100
                      : 0
                  ).toFixed(2) + "%"}
                </div>
                <div className="flex items-center gap-3 ">
                  {" "}
                  3 <FaStar size={20} className=" text-yellow-400" />
                  <div className="w-full flex items-center justify-center">
                    <div class=" w-full  rounded-full ">
                      <ProgressBar
                        customLabel={" "}
                        completed={parseFloat(
                          (arr_start[2] / reviews?.length) * 100
                            ? (arr_start[2] / reviews?.length) * 100
                            : 0
                        ).toFixed(2)}
                      />
                    </div>
                  </div>
                  {parseFloat(
                    (arr_start[2] / reviews?.length) * 100
                      ? (arr_start[2] / reviews?.length) * 100
                      : 0
                  ).toFixed(2) + "%"}
                </div>
                <div className="flex items-center gap-3 ">
                  {" "}
                  4 <FaStar size={20} className=" text-yellow-400" />
                  <div className="w-full flex items-center justify-center">
                    <div class=" w-full  rounded-full ">
                      <ProgressBar
                        customLabel={" "}
                        completed={parseFloat(
                          (arr_start[3] / reviews?.length) * 100
                            ? (arr_start[3] / reviews?.length) * 100
                            : 0
                        ).toFixed(2)}
                      />
                    </div>
                  </div>
                  {parseFloat(
                    (arr_start[3] / reviews?.length) * 100
                      ? (arr_start[3] / reviews?.length) * 100
                      : 0
                  ).toFixed(2) + "%"}
                </div>
                <div className="flex items-center gap-3 ">
                  {" "}
                  5 <FaStar size={20} className=" text-yellow-400" />
                  <div className="w-full flex items-center justify-center">
                    <div class=" w-full  rounded-full ">
                      <ProgressBar
                        customLabel={" "}
                        completed={parseFloat(
                          (arr_start[4] / reviews?.length) * 100
                            ? (arr_start[4] / reviews?.length) * 100
                            : 0
                        ).toFixed(2)}
                      />
                    </div>
                  </div>
                  {parseFloat(
                    (arr_start[4] / reviews?.length) * 100
                      ? (arr_start[4] / reviews?.length) * 100
                      : 0
                  ).toFixed(2) + "%"}
                </div>
                <div className="flex gap-1  mt-5">
                  <div>Inventory quantity:</div>
                  <div>{products?.inventory_quantity}</div> products
                </div>
                <div className="flex gap-1 ">
                  <div>Sold:</div>
                  <div>{products.selling_strategy}</div> products
                </div>
                <div>
                  <h3>
                    There are{" "}
                    <span className="text-bold">{reviews?.length}</span> reviews
                  </h3>
                </div>
                <div className="mt-4 flex items-center gap-5">
                  {parseFloat(start_Average).toFixed(2)}/5{" "}
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((item) => {
                      return (
                        <FaStar
                          size={20}
                          className={` ${
                            item <= start_Average ? " text-yellow-400" : " "
                          }  `}
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="mt-5">
                  <button
                    onClick={() => handleAddCart(products)}
                    type="button"
                    class="  relative py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400
                 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    Add Cart
                  </button>
                  <Link
                    to={"/allproducts"}
                    class=" relative py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400
                 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    {" "}
                    Go Back
                  </Link>
                </div>
              </div>
            </div>
          </section>
          {reviews &&
            reviews.map((item, index) => {
              return (
                <section key={index} className="border-b-2">
                  <div className="flex  ">
                    <div className="w-1/3  p-3">
                      <div className="flex items-center gap-4 mb-3">
                        <img
                          className="w-16 h-16 rounded-full"
                          src={item?.imaUrlUser}
                          alt="none"
                        />
                        <h4 className=" font-bold">{item?.nameUser}</h4>
                      </div>

                      <div className="flex gap-3 flex-wrap">
                        {Array.isArray(item?.imaUrlComemnt) &&
                          item?.imaUrlComemnt?.map((item) => {
                          return(
                            <img className="w-[160px] h-[160px] border rounded" src={item} />
                          )
                          })}
                        {/* <img
                    className="w-[200px] h-[200px]"
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcumO8Dvq_vv_B1u1tDha3BEXqKQb_ZRSEzg&usqp=CAU"
                  /> */}
                      </div>
                    </div>

                    <div className="w-2/3 flex gap-3 flex-col p-3">
                      <div className="flex justify-between   ">
                        <div className="flex gap-1 ">
                          {[...Array(5).keys()].map((start, index) => {
                            return (
                              <FaStar
                                size={20}
                                className={` ${
                                  index+1 <= item?.start_number
                                    ? " text-yellow-400"
                                    : ""
                                }  font-bold`}
                              />
                            );
                          })}
                        </div>

                        <div>2022-03-19</div>
                      </div>

                      <div>{item?.comment}</div>
                      <div className="mt-7 flex gap-3 items-center font-bold">
                        What this helpfull ? <BiLike size={25} />{" "}
                        <BiDislike size={25} />
                      </div>
                    </div>
                  </div>
                </section>
              );
            })}
        </div>
      )}
    </Layout>
  );
}

export default Reviews;
