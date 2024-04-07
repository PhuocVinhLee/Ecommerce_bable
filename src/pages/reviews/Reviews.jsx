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
import ProgressBar from "@ramonak/react-progress-bar";


function Reviews() {
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
    update_inventoryAndSelling_Product,
    user_infor,
    order,
  } = context;

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

  const [products, setProducts] = useState("");
  const params = useParams();
  // console.log(products.title)

  const getProductData = async () => {
    setLoading(true);
    try {
      const productTemp = await getDoc(doc(fireDB, "products", params.id));
      // console.log(productTemp)
      setProducts(productTemp.data());
      // console.log(productTemp.data())
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

    const review_return = await getReviewDate(params.id);

    const caculater_start = async () => {
      let caculater = 0;
      review_return?.forEach((review) => {
        caculater = caculater + review?.start_number;
      });
      if (!caculater / review_return?.length) {
        return 0;
      }
      return caculater / review_return?.length;
    };
    await update_inventoryAndSelling_Product({
      ...products,
      start_number: await caculater_start(),
    }); // update start number

    getProductData();

    setshowAddReview(false);
  };

  const handdleSetShowReview = async () => {
    const order = await get_OneOrdertData(params?.id_order);
    const find_one_order = order.cartItems.find((product) => {
      return product.id == params?.id;
    });

    if (order?.status != "completed") {
      return toast.error("The product has not been completed");
    } else if (find_one_order?.reviewed) {
      return toast.error("The product has been evaluated"); // hom nay toi day
    }
    setshowAddReview(!showAddReview);
  };
  const [showAddReview, setshowAddReview] = useState(false);
  useEffect(() => {
    console.log(review);
  }, [review]);
  return (
    <Layout>
      {products && (
        <div>
          {" "}
          <section className=" border-b-2">
            <div className="flex">
              <div className="w-1/3 flex flex-col justify-start p-3">
                <img
                  className=" bg-slate-400 mt-0 w-[400px] h-[400px]"
                  src={products.imageUrl}
                  alt=""
                />
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
              <div>
            
              </div>
              <div className="w-2/3 flex flex-col  justify-center p-3">
                <div className="flex items-center gap-3 ">
                  {" "}
                  1 <FaStar size={20} className=" text-yellow-400" />
                  <div className="w-full flex items-center justify-center">
                    <div class=" w-full rounded-full">
                    <ProgressBar customLabel={" "}  completed={parseFloat((arr_start[0]/reviews?.length *100) ? (arr_start[0]/reviews?.length *100) : 0)} />
                    </div>
                  </div>
                  {parseFloat((arr_start[0]/reviews?.length *100) ? (arr_start[0]/reviews?.length *100) : 0).toFixed(2)  +"%"}
                  
                </div>
                <div className="flex items-center gap-3 ">
                  {" "}
                  2 <FaStar size={20} className=" text-yellow-400" />
                  <div className="w-full flex items-center justify-center">
                    <div class=" w-full  rounded-full ">
                    <ProgressBar customLabel={" "}  completed={parseFloat((arr_start[1]/reviews?.length *100) ? (arr_start[1]/reviews?.length *100) : 0)} />
                    </div>
                  </div>
                  {parseFloat((arr_start[1]/reviews?.length *100) ? (arr_start[1]/reviews?.length *100) : 0).toFixed(2)  +"%"}
                </div>
                <div className="flex items-center gap-3 ">
                  {" "}
                  3 <FaStar size={20} className=" text-yellow-400" />
                  <div className="w-full flex items-center justify-center">
                  <div class=" w-full  rounded-full ">
                    <ProgressBar customLabel={" "}  completed={parseFloat((arr_start[2]/reviews?.length *100) ? (arr_start[2]/reviews?.length *100) : 0).toFixed(2)} />
                    </div>
                  </div>
                  {parseFloat((arr_start[2]/reviews?.length *100) ? (arr_start[2]/reviews?.length *100) : 0).toFixed(2)  +"%"}
                </div>
                <div className="flex items-center gap-3 ">
                  {" "}
                  4 <FaStar size={20} className=" text-yellow-400" />
                  <div className="w-full flex items-center justify-center">
                  <div class=" w-full  rounded-full ">
                    <ProgressBar customLabel={" "} completed={parseFloat((arr_start[3]/reviews?.length *100) ? (arr_start[3]/reviews?.length *100) : 0).toFixed(2)} />
                    </div>
                  </div>
                  {parseFloat((arr_start[3]/reviews?.length *100) ? (arr_start[3]/reviews?.length *100) : 0).toFixed(2)+"%"}
                </div>
                <div className="flex items-center gap-3 ">
                  {" "}
                  5 <FaStar size={20} className=" text-yellow-400" />
                  <div className="w-full flex items-center justify-center">
                  <div class=" w-full  rounded-full ">
                    <ProgressBar customLabel={" "}  completed={parseFloat((arr_start[4]/reviews?.length *100) ? (arr_start[4]/reviews?.length *100) : 0).toFixed(2)} />
                    </div>
                  </div>
                  {parseFloat((arr_start[4]/reviews?.length *100) ? (arr_start[4]/reviews?.length *100) : 0).toFixed(2) +"%"}
                </div>

                {/* {inventory_quantity} */}
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
                    <span className="text-bold">{reviews?.length }</span> reviews
                  </h3>
                </div>
                <div className="mt-4 flex items-center gap-5">
                  {parseFloat(products?.start_number ?products?.start_number:0 ).toFixed(2)}/5{" "}
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((item) => {
                      return (
                        <FaStar
                          size={20}
                          className={` ${
                            item <= products?.start_number
                              ? " text-yellow-400"
                              : " "
                          }  `}
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="mt-5">
                  <button
                    onClick={handdleSetShowReview}
                    type="button"
                    class=" relative py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400
                 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    Add your review
                  </button>
                  <Link
                    to={"/order"}
                    class=" relative py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400
                 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    {" "}
                    Go Back
                  </Link>
                </div>
                {showAddReview && (
                  <div className=" relative">
                    <div className=" absolute top-0 left-0 w-[100%] h-[300px] border rounded-sm z-10  bg-slate-200  dark:bg-black p-3">
                      <div class="max-w-sm mx-auto">
                        <div class="mb-5">
                          <label
                            for="email"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Your message
                          </label>
                          <input
                            value={review.comment}
                            onChange={(e) => {
                              setReview({ ...review, comment: e.target.value });
                            }}
                            type="text"
                            id="text"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required
                          />
                        </div>
                        <div class="mb-5">
                          <label
                            for="password"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            ImageUrl
                          </label>
                          <input
                            value={review.imaUrlComemnt}
                            onChange={(e) => {
                              setReview({
                                ...review,
                                imaUrlComemnt: e.target.value,
                              });
                            }}
                            type="text"
                            id="password"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required
                          />
                        </div>
                        <div class="mb-5 flex items-center gap-3  ">
                          <label
                            for="password"
                            class="  block text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Start for product :
                          </label>
                          <div className="flex gap-4">
                            {[1, 2, 3, 4, 5].map((start, index) => {
                              return (
                                <div
                                  onClick={() => {
                                    setReview({
                                      ...review,
                                      start_number: start,
                                    });
                                  }}
                                >
                                  <FaStar
                                    size={20}
                                    className={` ${
                                      start <= review.start_number
                                        ? " text-yellow-400"
                                        : ""
                                    }  font-bold`}
                                  />
                                </div>
                              );
                            })}{" "}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            handleAddreview();
                          }}
                          class="me-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                          Submit
                        </button>
                        <button
                          onClick={() => {
                            setshowAddReview(false);
                          }}
                          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}
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
                        <img
                          className="w-[200px] h-[200px]"
                          src={item?.imaUrlComemnt}
                        />
                        {/* <img
                    className="w-[200px] h-[200px]"
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcumO8Dvq_vv_B1u1tDha3BEXqKQb_ZRSEzg&usqp=CAU"
                  /> */}
                      </div>
                    </div>

                    <div className="w-2/3 flex gap-3 flex-col p-3">
                      <div className="flex justify-between   ">
                        {/* <div>
                          {item?.start_number}
                        </div> */}
                        <div className="flex gap-1 ">
                          {[...Array(5).keys()].map((start, index) => {
                            return (
                              <FaStar
                                size={20}
                                className={` ${
                                  index +1 <= item?.start_number
                                    ? " text-yellow-400"
                                    : ""
                                }  font-bold`}
                              />
                            );
                          })}
                        </div>

                        <div>2022-03-19</div>
                      </div>

                      <div>{item.comment}</div>
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
