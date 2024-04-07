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
  const addCart = (product) => {
    dispatch(addToCart({ product, productNumber: 1 }));
    toast.success("add to cart");
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const start_Average = useMemo(() => {
    let caculater = 0;
    reviews.forEach((review) => {
      caculater = caculater + review?.start_number;
    });
    if( ! caculater / reviews?.length){
      return 0
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
       {loading && <Loader/>}
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
                    onClick={() => addCart(products)}
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
                        <div className="flex gap-1 ">
                          {[...Array(5).keys()].map((start) => {
                            return (
                              <FaStar
                                size={20}
                                className={` ${
                                  start <= item?.start_number
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
