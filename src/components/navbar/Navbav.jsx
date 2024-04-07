import React, {
  useContext,
  useState,
  Fragment,
  useEffect,
  useRef,
} from "react";
import myContext from "../../context/data/myContext";
import { BsFillCloudSunFill } from "react-icons/bs";
import { FiSun } from "react-icons/fi";
import { Link } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { auth, fireDB } from "../../fireabase/FirebaseConfig";

import Logo from "../../assets/logo.png";
import { IoMdSearch } from "react-icons/io";
import { FaCartShopping } from "react-icons/fa6";
import { FaCaretDown } from "react-icons/fa";
import DarkMode from "./DarkMode";
import { RiMenuUnfoldLine } from "react-icons/ri";
import { IoClose } from "react-icons/io5";

function Navbavr() {
  const navigate = useNavigate();
  const context = useContext(myContext);
  const { setSearchkey,user_from_db } = context;
  
  const user = JSON.parse(localStorage.getItem("user"));
  const cartItems = useSelector((state) => state.cart);

  const headerRef = useRef(null);

  const stickyHeader = () => {
    window.addEventListener("scroll", () => {
      
if( document.body.clientWidth >=768 ||  document.documentElement.clientWidth >= 768){
  if (
    document.body.scrollTop > headerRef.current?.clientHeight ||
    document?.documentElement?.scrollTop > headerRef?.current?.clientHeight
  ) {
    headerRef.current.classList.add("sticky_header");
  } else {
    headerRef.current?.classList?.remove("sticky_header");
  }
}
    });
  };
  useEffect(() => {
    stickyHeader();
    return window.removeEventListener("scroll", stickyHeader);
  }, []);

  const handleClick = (e) =>{
      e.preventDefault();
      const targetAttr = e.target.getAttribute('href');
      const location = document.querySelector(targetAttr).offsetTop
      window.scrollTo({
          top:location - 80,
          left: 0
      })
  }

  const refMenu = useRef(null);

  const toggloMenu = () => {
    console.log("add lasss");
    refMenu.current.classList.toggle("show_menu");
  };

  const logout = async () => {
    signOut(auth)
      .then(() => {
        console.log("oke");
        localStorage.clear("user");
        navigate("/");
      })
      .catch((error) => {
        // An error happened.
      });
    // console.log("oke")
    // const respon = await signOut(auth);
    // console.log(respon)
    // if (respon) {
    //   localStorage.clear("user");
    //   navigate("/");
    // }
  };
  return (
    <div ref={headerRef}>
      {/* <div className="  fixed top-0 left-0  h-[100%] w-[90%] border border-red-700  bg-slate-400  z-[100000]">
  </div> */}

      <div className=" shadow-md  dark:bg-gray-900 dark:text-white bg-white  duration-200  z-40">
        {/* upper Navbar */}
        <div className="bg-primary/40 py-2">
          <div className="container flex justify-between items-center">
            <div>
              <Link
                to={"/"}
                href="#"
                className="font-bold text-2xl sm:text-3xl flex gap-2"
              >
                <img src={Logo} alt="Logo" className="w-10" />
                Shopsy
              </Link>
            </div>

            {/* search bar */}
            <div className="flex justify-between items-center gap-4">
              <div className="relative group hidden sm:block">
                <input                 onChange={(e) => setSearchkey(e.target.value)}
                  type="text"
                  placeholder="search"
                  className="w-[200px] sm:w-[200px] group-hover:w-[300px] transition-all duration-300 rounded-full border border-gray-300 px-2 py-1 focus:outline-none focus:border-1 focus:border-primary dark:border-gray-500 dark:bg-gray-800  "
                />
                <IoMdSearch className="text-gray-500 group-hover:text-primary absolute top-1/2 -translate-y-1/2 right-3" />
              </div>

              {/* order button */}

              {/* Darkmode Switch */}
              <div>
                <DarkMode />
              </div>
            </div>
          </div>
        </div>
        {/* lower Navbar */}
        <div className="flex   justify-between  container  py-1">
          <div className="flex items-center gap-2">
            <span
              onClick={toggloMenu}
              className=" text-2xl text-smallTextColor md:hidden cursor-pointer"
            >
              <RiMenuUnfoldLine />
            </span>
           {user ? ( <img
              className="inline-block w-7 h-7 rounded-full"
              src={user_from_db?.imageURL}
              alt="not"
            />) : ""}

            {user ? (
              <div onClick={logout} className="flow-root">
                <a className="dark:text-white block p-2 font-medium text-gray-900 cursor-pointer">
                  Logout
                </a>
              </div>
            ) : (
              ""
            )}
          </div>
          <div
            onClick={toggloMenu}
            //  md:bg-[#00000084]
            ref={refMenu}
            className=" md:flex md:static md:h-auto md:w-auto 
              md:dark:bg-gray-900 dark:text-white fixed top-0 left-0  h-[100%] w-[100%]  hidden z-[10]"
          >
            <ul
              className=" bg-white  dark:bg-gray-900 md:p-0 md:static flex md:flex-row flex-col md:items-center md:h-auto md:w-auto  gap-4 absolute h-[100%] w-[50%]
            p-3 "
            >
              <div className=" block md:hidden border border-e-red-100 font-[500] hover:font-[600] hover:text-black hover:bg-white md:static absolute top-0 right-0 mt-2 mr-2 ">
                <IoClose />
              </div>
              {!user && ( <Link  to={"/login"} className="text-sm font-medium ">
                Login
              </Link>)}
             
              <Link to={"/allproducts"} className="text-sm font-medium ">
                All Products
              </Link>
              {user ? (
                <div className="flow-root">
                  <Link to={"/order"} className="-m-2 block p-2 font-medium">
                    Order
                  </Link>
                </div>
              ) : (
                " "
              )}

              {user?.email === "admin@gmail.com" ? (
                <div className="flow-root">
                  <Link
                    to={"/dashboard/productdetail "}
                    className="-m-2 block p-2 font-medium"
                  >
                    Admin
                  </Link>
                </div>
              ) : (
                " "
              )}
              <li className="group relative cursor-pointer">
                <p  className="flex items-center gap-[2px] py-2">
                  Trending Products
                  <span>
                    <FaCaretDown className="transition-all duration-200 group-hover:rotate-180" />
                  </span>
                </p>
                <div className="absolute border z-[9999] hidden group-hover:block w-[200px] rounded-md bg-white p-2 text-black shadow-md">
                  <ul>
                    
                      <li >
                        <a
                        onClick={handleClick}  
                          className="inline-block w-full  rounded-md p-2 hover:bg-primary/20 "
                        >
                          Trending Product
                        </a>
                      </li>
                      <li >
                        <a href="#SellingProducts" onClick={handleClick}  
                        
                          className="inline-block w-full rounded-md p-2 hover:bg-primary/20 "
                        >
                          Best Selling
                        </a>
                      </li>
                      <li >
                        <a onClick={handleClick}   href="#TopProducts"
                        
                          className="inline-block w-full rounded-md p-2 hover:bg-primary/20 "
                        >
                          Top Rated
                        </a>
                      </li>
                   
                  </ul>
                </div>
              </li>
            </ul>
          </div>
          <div className="flex items-center">
            <button className="   bg-gradient-to-r from-primary to-secondary transition-all duration-200 text-white md:py-1 md:px-4 py-0 px-2  rounded-full flex items-center gap-3 group">
              <Link to={"/cart"} className="group -m-2 flex items-center p-2">
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
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  />
                </svg>

                <span className="ml-2 text-sm font-medium text-gray-700 group-">
                  {cartItems.length}
                </span>
                <span className="sr-only">items in cart, view bag</span>
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbavr;
