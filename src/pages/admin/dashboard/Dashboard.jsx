import React, { useContext } from "react";
import { FaUserTie } from "react-icons/fa";
import myContext from "../../../context/data/myContext";
import Layout from "../../../components/layout/Layout";
import DashboardTab from "./DashboardTab";
import { IoCartOutline } from "react-icons/io5";
import { FaShoppingBag } from "react-icons/fa";
import { IoBag } from "react-icons/io5";

import { FaUserFriends } from "react-icons/fa";
function Dashboard() {
  const context = useContext(myContext);
  const { mode } = context;
  return (
    <Layout>
      <section className="text-gray-600 body-font mt-10 mb-10">
        <div className="container px-5 mx-auto mb-10">
          <div className="flex flex-wrap -m-4  text-center">

            <div className="p-4 md:w-1/4 sm:w-1/2 w-full">  
            {/* {bg-white dark:bg-gray-800 hover:bg-black/80 dark:hover:bg-primary hover:text-white } */}
              <div
                className=" flex flex-col gap-y-10 border-1  bg-white  dark:text-white dark:bg-gray-800  dark:hover:bg-primary hover:text-white
                 hover:bg-primary/40 shadow-xl  hover:border-primary/40 border-x-white px-4 py-3 rounded-xl"
                style={{
                  backgroundColor: mode === "dark" ? "rgb(46 49 55)" : "",
                  color: mode === "dark" ? "white" : "",
                }}
              >
                <div className=" " >
                  <   IoCartOutline size={40} className="rounded-full h-14 w-14 p-3 bg-slate-200 dark:bg-white dark:text-black" />
                </div>
                <div className="flex justify-between" >
                    <div>Total Products</div>
                    <div className=" font-bold">20</div>
                </div>
              </div>
            </div>
            <div className="p-4 md:w-1/4 sm:w-1/2 w-full">  
            {/* {bg-white dark:bg-gray-800 hover:bg-black/80 dark:hover:bg-primary hover:text-white } */}
              <div
                className=" flex flex-col gap-y-10 border-1  bg-white  dark:text-white dark:bg-gray-800  dark:hover:bg-primary hover:text-white
                 hover:bg-primary/40 shadow-xl  hover:border-primary/40 border-x-white px-4 py-3 rounded-xl"
                style={{
                  backgroundColor: mode === "dark" ? "rgb(46 49 55)" : "",
                  color: mode === "dark" ? "white" : "",
                }}
              >
                <div className=" " >
                  <   FaUserFriends size={40} className="rounded-full h-14 w-14 p-3 bg-slate-200 dark:bg-white dark:text-black" />
                </div>
                <div className="flex justify-between" >
                    <div>Total Users</div>
                    <div className=" font-bold">5</div>
                </div>
              </div>
            </div>
            <div className="p-4 md:w-1/4 sm:w-1/2 w-full">  
            {/* {bg-white dark:bg-gray-800 hover:bg-black/80 dark:hover:bg-primary hover:text-white } */}
              <div
                className=" flex flex-col gap-y-10 border-1  bg-white  dark:text-white dark:bg-gray-800  dark:hover:bg-primary hover:text-white
                 hover:bg-primary/40 shadow-xl  hover:border-primary/40 border-x-white px-4 py-3 rounded-xl"
                style={{
                  backgroundColor: mode === "dark" ? "rgb(46 49 55)" : "",
                  color: mode === "dark" ? "white" : "",
                }}
              >
                <div className=" " >
                  <   IoBag  size={40} className="rounded-full h-14 w-14 p-3 bg-slate-200 dark:bg-white dark:text-black" />
                </div>
                <div className="flex justify-between" >
                    <div>Total Order</div>
                    <div className=" font-bold">15</div>
                </div>
              </div>
            </div>
            <div className="p-4 md:w-1/4 sm:w-1/2 w-full">  
            {/* {bg-white dark:bg-gray-800 hover:bg-black/80 dark:hover:bg-primary hover:text-white } */}
              <div
                className=" flex flex-col gap-y-10 border-1  bg-white  dark:text-white dark:bg-gray-800  dark:hover:bg-primary hover:text-white
                 hover:bg-primary/40 shadow-xl  hover:border-primary/40 border-x-white px-4 py-3 rounded-xl"
                style={{
                  backgroundColor: mode === "dark" ? "rgb(46 49 55)" : "",
                  color: mode === "dark" ? "white" : "",
                }}
              >
                <div className=" " >
                  <   IoCartOutline size={40} className="rounded-full h-14 w-14 p-3 bg-slate-200 dark:bg-white dark:text-black" />
                </div>
                <div className="flex justify-between" >
                    <div>Total Categorys</div>
                    <div className=" font-bold">4</div>
                </div>
              </div>
            </div>
           
          </div>
       
       
        </div>
        <DashboardTab></DashboardTab>
      </section>

      <section></section>
    </Layout>
  );
}

export default Dashboard;
