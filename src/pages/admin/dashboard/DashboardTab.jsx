import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import myContext from "../../../context/data/myContext";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { FaUser, FaCartPlus } from "react-icons/fa";
import { BiCategory } from "react-icons/bi";
import { AiFillShopping, AiFillPlusCircle, AiFillDelete } from "react-icons/ai";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  Link,
  Outlet
} from "react-router-dom";

function Dashboarddiv() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const context = useContext(myContext);
  const {
    mode,
    product,
    categorys,
    edithandle,
    updateProduct,
    deleteProduct,
    order,
    user,
  } = context;
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }
  const add = () => {
    //window.location.href = "/addproduct";
    navigate("/addproduct");
  };


  const addCategory = () => {
    navigate("/addcategory");
  };
  return (
    <>
      <div className=" mx-auto">
        <div className="div  mx-auto px-5 ">
          <div >
            <div className="md:flex md:space-x-8 grid grid-cols-2  text-center gap-4   md:justify-center mb-10 ">
              <div>
                <Link
                  to={"productdetail"}
                  type="button"
                  className= {`"  ${ pathname == "/dashboard/productdetail" ?  " border border-primary " : " "} flex font-medium border-b-2  dark:text-white dark:bg-gray-800  dark:hover:bg-primary bg-white hover:bg-primary text-black rounded-lg text-xl shadow-[inset_0_0_8px_rgba(0,0,0,0.6)]  px-5 py-1.5 text-center"
  `}> 
                  <div className="flex gap-2 items-center">
                    <MdOutlineProductionQuantityLimits />
                    Products
                  </div>{" "}
                </Link>
              </div>
              <div>
              <Link
                  to={"categorydetail"}
                  type="button"
                  className= {`"  ${ pathname == "/dashboard/categorydetail" ?  " border border-primary " : " "} flex font-medium border-b-2  dark:text-white dark:bg-gray-800  dark:hover:bg-primary bg-white hover:bg-primary text-black rounded-lg text-xl shadow-[inset_0_0_8px_rgba(0,0,0,0.6)]  px-5 py-1.5 text-center"
                  `}> 
                  <div className="flex gap-2 items-center">
                    <BiCategory /> CaTegory
                  </div>
              </Link>
              </div>
              <div>
              <Link
                  to={"orderdetail"}
                  type="button"
                  className= {`"  ${ pathname == "/dashboard/orderdetail" ?  " border border-primary " : " "} flex font-medium border-b-2  dark:text-white dark:bg-gray-800  dark:hover:bg-primary bg-white hover:bg-primary text-black rounded-lg text-xl shadow-[inset_0_0_8px_rgba(0,0,0,0.6)]  px-5 py-1.5 text-center"
                  `}> 
                  <div className="flex gap-2 items-center">
                    <AiFillShopping /> Order
                  </div>
                </Link>
              </div>
              <div>
              <Link
                  to={"userdetail"}
                  type="button"
                  className= {`"  ${ pathname == "/dashboard/userdetail" ?  " border border-primary " : " "} flex font-medium border-b-2  dark:text-white dark:bg-gray-800  dark:hover:bg-primary bg-white hover:bg-primary text-black rounded-lg text-xl shadow-[inset_0_0_8px_rgba(0,0,0,0.6)]  px-5 py-1.5 text-center"
                  `}> 
                  <div className="flex gap-2 items-center">
                    <FaUser /> Users
                  </div>
               </Link>
              </div>
            </div>

            <Outlet></Outlet>
          </div>
          
        </div>
      </div>

    
    </>
  );
}

export default Dashboarddiv;
