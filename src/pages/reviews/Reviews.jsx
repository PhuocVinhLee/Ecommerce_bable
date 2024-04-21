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

import Slider from "react-slick";

import CustomInput from "./CustomInput";
import CustomInputImage from "./CustomInputImage";
import CustomTextarea from "./CustomTextarea";
import { advancedSchema } from "./schemas";
import { Form, Formik } from "formik";

import {
  ref,
  uploadBytes,
  getStorage,
  listAll,
  getDownloadURL,
} from "firebase/storage";
import uuid from "react-uuid";
import { storage } from "../../fireabase/FirebaseConfig";
import Loader from "../../components/loader/Loader";

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
    comment:
      "For instance, I had a problem because the index.html file pointed to and that's is correct if we release the application in the root folder, but if you have various static developments in the same machine using the same Apache Server you have a problem.",
    imaUrlComemnt: [],
    // time: Timestamp.now(),
  });

  const handleAddreview = async (review_local) => {
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
      return product.id == products?.id;
    });

    if (order?.status != "completed") {
      return toast.error("The product has not been completed");
    } else if (find_one_order?.reviewed) {
      return toast.error("The product has been evaluated"); // hom nay toi day
    }
    setshowAddReview(!showAddReview);
  };

  const onSubmit = async (values, actions) => {
    try {
      setLoading(true);
      const arr_url = [];

      for (const image of values.imaUrlComemnt) {
        const imaRef = ref(storage, `reviews/${uuid()}`);
        const spaceRef = await uploadBytes(imaRef, image);
        const url = await getDownloadURL(spaceRef.ref);
        arr_url.push(url);
      }

      const review_local = {
        ...values,
        imaUrlComemnt: arr_url,
        uid: user_from_db?.id,
        imaUrlUser: user_from_db?.imageURL,
        nameUser: user_from_db?.name,
        time: Timestamp.now(),
        idProduct: params?.id,
      };

      await handleAddreview(review_local);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const [showAddReview, setshowAddReview] = useState(false);
  useEffect(() => {
    console.log(review);
  }, [review]);
  return (
    <Layout>
      {loading && <Loader />}
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
              <div></div>

              <div className="w-2/3 flex flex-col  justify-start p-3">
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
                    <span className="text-bold">{reviews?.length}</span> reviews
                  </h3>
                </div>
                <div className="mt-4 flex items-center gap-5">
                  {parseFloat(
                    products?.start_number ? products?.start_number : 0
                  ).toFixed(2)}
                  /5{" "}
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
                    <div className="  top-0 left-0 w-[100%] h-[100%]  border rounded-sm z-5  bg-slate-200  dark:bg-black p-3">
                      <div class="mx-auto border">
                        <Formik
                          initialValues={review}
                          validationSchema={advancedSchema}
                          enableReinitialize={true}
                          onSubmit={onSubmit}
                        >
                          {({
                            isSubmitting,
                            values,
                            errors,
                            setFieldValue,
                          }) => (
                            <Form className=" w-full ">
                              <div className=" grid sm:grid-cols-2 grid-cols-1  gap-4   w-full ">
                                <CustomTextarea
                                  label="coment"
                                  type="text"
                                  cols="20"
                                  rows="7"
                                  name="comment"
                                  placeholder="Enter description"
                                />

                                <div>
                                  <CustomInputImage
                                    label="Imageurl"
                                    name="imaUrlComemnt"
                                    type="file"
                                    multiple="true"
                                    placeholder="Enter imageurl"
                                    accept="image/*"
                                  />

                                  <div className="mt-3 mb-5   flex gap-5 sm:gap-4 w-ful flex-wrap">
                                    {values?.imaUrlComemnt?.length != 0 &&
                                      values?.imaUrlComemnt?.map(
                                        (image, index) => {
                                          return (
                                            <div
                                              data-aos="flip-up"
                                              ease-out
                                              data-aos-once="true"
                                              className="relative group   "
                                            >
                                              <img
                                                className={`" ${
                                                  errors?.imaUrlComemnt &&
                                                  errors?.imaUrlComemnt[index]
                                                    ? " border-2 border-red-500"
                                                    : "border-2 border-green-500"
                                                } h-[100px] w-[100px]  "  `}
                                                src={URL.createObjectURL(image)}
                                                alt="none"
                                                srcset=""
                                              />

                                              <button
                                                onClick={() => {
                                                  const filterImage =
                                                    values?.imaUrlComemnt.filter(
                                                      (image, index_local) => {
                                                        return (
                                                          index != index_local
                                                        );
                                                      }
                                                    );
                                                  console.log(index);
                                                  console.log(filterImage);
                                                  return setFieldValue(
                                                    "imaUrlComemnt",
                                                    filterImage
                                                  );
                                                }}
                                                type="button"
                                                class=" group-hover:inline-block hidden absolute -top-2 -right-2  bg-slate-50 rounded-md p-1  items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                                              >
                                                <span class="sr-only">
                                                  Close menu
                                                </span>

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
                                        }
                                      )}
                                    {values.imaUrlComemnt &&
                                      values.imaUrlComemnt.name}
                                  </div>
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
                                            setFieldValue(
                                              "start_number",
                                              start
                                            );
                                            // setReview({
                                            //   ...review,
                                            //   start_number: start,
                                            // });
                                          }}
                                        >
                                          <FaStar
                                            size={20}
                                            className={` ${
                                              start <= values?.start_number
                                                ? " text-yellow-400"
                                                : ""
                                            }  font-bold`}
                                          />
                                        </div>
                                      );
                                    })}{" "}
                                  </div>
                                </div>

                                <div>
                                  <button
                                    disabled={isSubmitting}
                                    type="submit"
                                    // onClick={() => {
                                    //   handleAddreview();
                                    // }}
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
                            </Form>
                          )}
                        </Formik>
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
                        {/* <div>
                          {item?.start_number}
                        </div> */}
                        <div className="flex gap-1 ">
                          {[...Array(5).keys()].map((start, index) => {
                            return (
                              <FaStar
                                size={20}
                                className={` ${
                                  index + 1 <= item?.start_number
                                    ? " text-yellow-400"
                                    : ""
                                }  font-bold`}
                              />
                            );
                          })}
                        </div>
                       

                        <div>2024-04-15</div>
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
