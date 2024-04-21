import React, { useContext, useEffect, useState } from "react";
import moment from "moment";

import ChartTotalRevenue from "./ChartTotalRevenue";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { PointElement, LineElement } from "chart.js";

import { Bar } from "react-chartjs-2";
import { Line } from "react-chartjs-2";
function ChartTotalProduct({ orders }) {
  const [chartFormatBar, setChartFormatBar] = useState("year");

  const [now, setNow] = useState(new Date());

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
        text: "The chart above shows the number of products sold",
        font: {
          size: 20,
        },
        position: "bottom",
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

  const caculaterData = async (statusOrder, format_type, detail_type) => {
    const product_number_in_month = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const product_number_in_week = [0, 0, 0, 0, 0]; // 1-7 8-14 15-21 22-28 29-end
console.log(format_type)
console.log(detail_type)
    orders?.map((order) => {
      if (order?.date) {
        const moonLanding = moment(order?.date, "hh:mm:ss DD/M/YYYY a");

        var monthLocal = moonLanding.format("M");
        var yearLocal = moonLanding.format("YYYY"); // 2024
        var day = moonLanding.format("DD");

        let count_product = 0;

        if (format_type === "year" && yearLocal == detail_type?.year) {
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
        } else if (
          format_type === "month" &&
          yearLocal == detail_type?.year &&
          monthLocal == detail_type?.month
        ) {
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
        }

        product_number_in_week[Math.ceil(day / 7) - 1] = product_number_in_week[Math.ceil(day / 7) - 1] + count_product
        product_number_in_month[monthLocal - 1] =
          product_number_in_month[monthLocal - 1] + count_product;
      }
    });

    if(format_type === "month") return product_number_in_week;
    return product_number_in_month;
  };
  const setDataChart = async () => {
    if (chartFormatBar == "year") {
      const allOrder = await caculaterData("all", "year", {
        year: now?.getFullYear(),
      });
      const scancelOrder = await caculaterData("canceled", "year", {
        year: now?.getFullYear(),
      });
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
    } else if(chartFormatBar == "month"){
        const allOrder = await caculaterData("all", "month", {
            year: now?.getFullYear(),
            month: now?.getMonth() +1
        
          });
          const scancelOrder = await caculaterData("canceled", "month", {
            year: now?.getFullYear(),
            month: now?.getMonth() + 1
          });
          const month = [
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
          const labelsBarMonth = ["1 - 7", "8 - 14", "15 - 21", "22 - 28", "29 - end"];
          setData({
          labels: labelsBarMonth,
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
    }
  };

  useEffect(() => {
    setDataChart();
  }, [orders, chartFormatBar]);

  return (
    <div className="mt-5 mb-5 ">
      <div className="flex justify-between items-center">
        <div></div>
        <div>
          <button
            onClick={() => {
              setChartFormatBar("year");
            }}
            type="button"
            class={` ${
              chartFormatBar == "year" ? " border-gray-900" : " border-gray-300"
            } "text-gray-900 hover:text-white border hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"`}
          >
            Year
          </button>
          <button
            onClick={() => {
              setChartFormatBar("month");
            }}
            type="button"
            class={` ${
              chartFormatBar == "month"
                ? " border-gray-900"
                : " border-gray-300"
            } "text-gray-900 hover:text-white border hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"`}
          >
            Month{" "}
          </button>

          {/* <button
            onClick={() => {
              setChartFormatBar("week");
            }}
            type="button"
            class={` ${
              chartFormatBar == "week" ? " border-gray-900" : " border-gray-300"
            } "text-gray-900 hover:text-white border hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"`}
          >
            Week
          </button> */}
        </div>
      </div>
      <div></div>
      <Bar options={options} data={data} />
    </div>
  );
}

export default ChartTotalProduct;
