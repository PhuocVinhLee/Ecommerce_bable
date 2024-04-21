import React, { useContext, useEffect, useRef, useState } from "react";
import Filter from "../../components/filter/Filter";
import ProductCard from "../../components/productCard/ProductCard";
import Layout from "../../components/layout/Layout";
import myContext from "../../context/data/myContext";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/cartSlice";
import Breadcrumbs from "../../components/allProducts/Breadcrumbs";
import ShopSideNav from "../../components/allProducts/ShopSideNav";
import ProductBanner from "../../components/allProducts/ProductBanner";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import Loader from "../../components/loader/Loader";
import { PiStarThin } from "react-icons/pi";

import Slider from "react-slick";

function Allproducts() {
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
    mode,
    loading,
    product,
    searchkey,
    setSearchkey,
    filterType,
    setFilterType,
    filterPrice,
    setFilterPrice,
    getProductData,
    sortBy,
    show,
  } = context;
  useEffect(() => {
    setFilterPrice("all");
    setFilterType("all");
    setSearchkey("");
  }, []);

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart);
  console.log(cartItems);
  const converttimeSap = (time) => {
    const fireBaseTime = new Date(
      time?.seconds * 1000 + time?.nanoseconds / 1000000
    );
    const date = fireBaseTime.toDateString();
    const atTime = fireBaseTime.toLocaleTimeString();
    return { date: date, time: atTime };
  };
  const addCart = () => {
    if (color && size && quantity) {
      setModal(false)
      setSize("")
      setColor("")
      setQuantity(1)
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    getProductData();
  }, []);
  const [productFilters, SetproductFilters] = useState([]);

  useEffect(() => {
    console.table(product);
    console.log(searchkey, filterPrice, filterType);
    const productSearchkeys = product.filter((obj) =>
      obj.title.toLowerCase().includes(searchkey)
    );
    const productfilterTypes =
      filterType == "all"
        ? productSearchkeys
        : productSearchkeys.filter((obj) => obj.category.includes(filterType));

    const productfilterPrice =
      filterPrice == "all"
        ? productfilterTypes
        : productfilterTypes.filter((obj) => {
            if (filterPrice == 900) return Number(obj.price) >= filterPrice;
            return (
              Number(obj.price) >= filterPrice &&
              Number(obj.price) <= Number(filterPrice) + 100
            );
          });

    const productSortBy = productfilterPrice.toSorted((a, b) => {
      if (sortBy == "best_sellers") {
        return b?.selling_strategy - a?.selling_strategy;
      } else if (sortBy == "price") {
        return a?.price - b?.price;
      }
      // else if(sort == "start_number") { return b?.number - a?.selling_strategy}
      else if (sortBy == "latest_product") {
        return (
         - a?.time.seconds 
         
          +(b?.time.seconds )
        );
      } else if (sortBy == "start_number") {
        console.log("test evs sklasl");
        return b?.start_number - a?.start_number;
      } else if (sortBy == "price") {
        return a?.price - b?.price;
      } else return productFilters;
    });

    console.log(show);
    const showFilter =
      show == "all" ? productSortBy : productSortBy.slice(0, Number(show));

    SetproductFilters(showFilter);

    console.log(productSortBy.slice(0, 13));
  }, [product, searchkey, filterPrice, filterType, sortBy, show]);

  const [itemsPerPage, setItemsPerPage] = useState(48);
  const itemsPerPageFromBanner = (itemsPerPage) => {
    setItemsPerPage(itemsPerPage);
  };
  const refMenuCategoryPrice = useRef(null);
  const toggloMenu = () => {
    console.log("add lasss");
    refMenuCategoryPrice.current.classList.toggle("show_shop_by");
  };

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

      <div className="  max-w-container mx-auto px-4  relative">
        {/* <Breadcrumbs title="Products" /> */}
        {/* ================= Products Start here =================== */}
        {/* shadow-[rgba(0,_0,_0,_0.2)_0px_60px_40px_-7px] */}
        <div className="w-full h-full flex pb-20 gap-10 p-3  ">
          <div
            ref={refMenuCategoryPrice}
            className="md:w-[25%]  md:p-1 p-5 lg:w-[20%] absolute top-0  md:static left-0  h-[100%] w-[100%] sm:w-[50%] border
           md:block hidden bg-primary/90 text-white md:text-black md:dark:text-white md:z-0 z-50 md:bg-white  md:dark:bg-gray-900"
          >
            <div className="w-full">
              <div
                onClick={toggloMenu}
                className=" block md:hidden border border-e-red-100 font-[500] hover:font-[600] hover:text-black hover:bg-white md:static absolute top-0 right-0 mt-2 mr-2 "
              >
                <IoClose />
              </div>
              <ShopSideNav toggloMenu={toggloMenu}></ShopSideNav>
            </div>
          </div>

          <div className="w-full  md:w-[80%] lgl:w-[75%] h-full flex flex-col gap-10">
            <div>
              {" "}
              <ProductBanner toggloMenu={toggloMenu} />
            </div>

            <div className=" sm:grid-cols-2 grid-cols-1 grid  2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2  gap-4  place-items-center">
              {productFilters.map((data) => (
                <div
                  data-aos="zoom-in"
                  className=" h-[350px]   w-full    rounded-2xl bg-white dark:bg-gray-800 hover:bg-black/80 dark:hover:bg-primary hover:text-white relative shadow-2xl duration-300 group "
                >
                  {/* image section */}

                  <Slider {...settings} className=" max-h-[160px]   ">
                    {data?.imageUrl.map((img, index) => {
                      return (
                        1 && (
                          <Link to={{ pathname: `/productinfo/${data.id}` }}>
                            <img
                              src={img}
                              alt=""
                              className="    max-w-[140px] min-w-[120px] max-h-[160px]  min-h-[150px]  block mx-auto transform -translate-y-19 group-hover:scale-105 duration-300 drop-shadow-md"
                            />
                          </Link>
                        )
                      );
                    })}
                  </Slider>
                  {/* details section */}
                  <div className="p-4 text-center">
                    <h1 className="text-xl font-bold line-clamp-1">
                      {data.title}
                    </h1>
                    <div className="line-clamp-2 mt-3">{data.description}</div>
                    <p className="text-gray-500 group-hover:text-white duration-300 text-sm line-clamp-2">
                      {/* {data.inventory_quantity} */}
                    </p>

                    {/* <p>
                      {" "}
                      {converttimeSap(data?.time).date +
                        " " +
                        converttimeSap(data?.time).time}
                    </p> */}
                    <div className="flex justify-between mt-3 ">
                      <div className="flex">
                        <span>Sold: </span>
                        <span className="font-bold ms-1">
                          {" "}
                          {data?.selling_strategy}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((item) => {
                          return (
                            <FaStar
                              size={20}
                              className={` ${
                                item <= data?.start_number
                                  ? " text-yellow-400"
                                  : " "
                              }  `}
                            />
                          );
                        })}
                      </div>
                      {/* <div className="w-full flex items-center justify-end gap-1">
                        <FaStar className="text-yellow-500" />
                        <FaStar className="text-yellow-500" />
                        <FaStar className="text-yellow-500" />
                        <FaStar className="text-yellow-500" />
                        <FaStar className="text-yellow-500" />
                      </div> */}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex gap-1">
                        <span>Price:</span>
                        <span className="font-bold">{data.price}$</span>
                      </div>

                      <button
                        className="bg-primary  hover:scale-105 duration-300 text-white py-1 px-4 rounded-full  group-hover:bg-white group-hover:text-primary"
                        onClick={() => handleAddCart(data)}
                      >
                        Add Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* ================= Products End here ===================== */}
      </div>

      {/* <Filter/> */}

      {/* <section className="text-gray-600 body-font">
            <div className="container px-5 py-8 md:py-16 mx-auto">
                <div class="lg:w-1/2 w-full mb-6 lg:mb-10">
                    <h1 class="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900" style={{ color: mode === 'dark' ? 'white' : '' }}>Our Latest Collection</h1>
                    <div class="h-1 w-20 bg-pink-600 rounded"></div>
                </div>

                <div className="flex flex-wrap -m-4">
                {productFilters.map((item, index) => {
            const { title, price, description, category, imageUrl, id } = item;
                        return (
                            <div    key={index} className="p-4 md:w-1/4  drop-shadow-lg " >
                                <div className="h-full border-2 hover:shadow-gray-100 hover:shadow-2xl transition-shadow duration-300 ease-in-out    border-gray-200 border-opacity-60 rounded-2xl overflow-hidden" style={{ backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : '', color: mode === 'dark' ? 'white' : '', }} >
                                    <div  onClick={()=> window.location.href = `/productinfo/${id}`} className="flex justify-center cursor-pointer" >
                                        <img className=" rounded-2xl w-full h-80 p-2 hover:scale-110 transition-scale-110  duration-300 ease-in-out" src={imageUrl} alt="blog" />
                                    </div>
                                    <div className="p-5 border-t-2">
                                        <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1" style={{ color: mode === 'dark' ? 'white' : '', }}>E-Bharat</h2>
                                        <h1 className="title-font text-lg font-medium text-gray-900 mb-3" style={{ color: mode === 'dark' ? 'white' : '', }}>{title}</h1>
                                       
                                        <p className="leading-relaxed mb-3" style={{ color: mode === 'dark' ? 'white' : '' }}>₹{price}</p>
                                        <div className=" flex justify-center">
                                            <button type="button" 
                                            onClick={()=> addCart(item)}
                                            className="focus:outline-none text-white bg-pink-600 hover:bg-pink-700 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm w-full  py-2">Add To Cart</button>

                                        </div>
                                    </div>

                                </div>
                            </div>
                        )
                    })}




                </div>

            </div>
        </section > */}
    </Layout>
  );
}

export default Allproducts;
