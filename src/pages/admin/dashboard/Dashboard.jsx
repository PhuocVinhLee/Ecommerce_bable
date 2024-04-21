import React, { useContext, useEffect, useState } from "react";
import { FaUserTie } from "react-icons/fa";
import myContext from "../../../context/data/myContext";
import Layout from "../../../components/layout/Layout";
import DashboardTab from "./DashboardTab";
import { IoCartOutline } from "react-icons/io5";
import { FaShoppingBag } from "react-icons/fa";
import { IoBag } from "react-icons/io5";

import { FaUserFriends } from "react-icons/fa";
import moment from "moment";

import ChartTotalRevenue from "./ChartTotalRevenue"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import ChartTotalProduct from "./ChartTotalProduct";

function Dashboard() {
  const context = useContext(myContext);
  const {
    mode,
    orders,
    getOrderData,
    getProductData,
    product,
    getCategorysData,
    categorys,
  } = context;
  useEffect(() => {
    getOrderData();
    getProductData();
  }, []);

  const [chartFormatBar, setChartFormatBar] = useState('year')

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

 

  const options = {
    maintainAspectRatio: true,
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          // This more specific font property overrides the global property
          font: {
            size: 18,
          },
        },
      },
      title: {
        display: true,
        text: "The chart above shows the number of products sold each month",
        font: {
          size: 20,
        },
        position: "bottom"
      },
    },
  };

 


  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [data, setData] = useState({
    labels,
    datasets: [
      {
        label: "Product canceled",
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        yAxisID: "y",
      },
      {
        label: "Product sold",
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],

        backgroundColor: "rgba(255, 99, 132, 0.5)",
        yAxisID: "y",
      },
    ],
  });


  const caculaterData = async (statusOrder) => {
    const product_number_in_month = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    orders?.map((order) => {
      if (order?.date) {
        const moonLanding = moment(order?.date, "hh:mm:ss YYYY/M/DD a");

        var monthLocal = moonLanding.format("M");
        let count_product = 0;

        if (statusOrder == "all") {
          if (order?.cartItems) {
            order?.cartItems.map((cartItem) => {
              if (cartItem?.quantity) {
                count_product = count_product + cartItem?.quantity;
              }
            });
          }
        } else {
          if (order?.cartItems && order?.status == statusOrder) {
            order?.cartItems.map((cartItem) => {
              if (cartItem?.quantity) {
                count_product = count_product + cartItem?.quantity;
              }
            });
          }
        }

        product_number_in_month[monthLocal - 1] =
          product_number_in_month[monthLocal - 1] + count_product;
      }
    });

    return product_number_in_month;
  };


  const setDataChart = async () => {
    const allOrder = await caculaterData("all");
    const scancelOrder = await caculaterData("canceled");
    setData({
      labels,
      datasets: [
        {
          label: "Product canceled",
          data: scancelOrder,
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          yAxisID: "y",
        },
        {
          label: "Product sold",
          data: allOrder,
          backgroundColor: "rgba(53, 162, 235, 0.5)",
          yAxisID: "y",
        },
      ],
    });
  };



  useEffect(() => {
    setDataChart();
    
  }, [orders]);
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
                <div className=" ">
                  <IoCartOutline
                    size={40}
                    className="rounded-full h-14 w-14 p-3 bg-slate-200 dark:bg-white dark:text-black"
                  />
                </div>
                <div className="flex justify-between">
                  <div>Total Products</div>
                  <div className=" font-bold">{product?.length}</div>
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
                <div className=" ">
                  <FaUserFriends
                    size={40}
                    className="rounded-full h-14 w-14 p-3 bg-slate-200 dark:bg-white dark:text-black"
                  />
                </div>
                <div className="flex justify-between">
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
                <div className=" ">
                  <IoBag
                    size={40}
                    className="rounded-full h-14 w-14 p-3 bg-slate-200 dark:bg-white dark:text-black"
                  />
                </div>
                <div className="flex justify-between">
                  <div>Total Order</div>
                  <div className=" font-bold">{orders?.length}</div>
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
                <div className=" ">
                  <IoCartOutline
                    size={40}
                    className="rounded-full h-14 w-14 p-3 bg-slate-200 dark:bg-white dark:text-black"
                  />
                </div>
                <div className="flex justify-between">
                  <div>Total Categorys</div>
                  <div className=" font-bold">{categorys?.length}</div>
                </div>
              </div>
            </div>
          </div>

          <div>
          <ChartTotalRevenue orders={orders}></ChartTotalRevenue>
          </div>
          <div>
          <ChartTotalProduct orders={orders}></ChartTotalProduct>
          </div>

          


        
        </div>

       
        <DashboardTab></DashboardTab>
      </section>

      <section></section>
    </Layout>
  );
}

export default Dashboard;
