import React, { useEffect, useState } from "react";
import moment from "moment";
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
import { FaArrowTrendUp } from "react-icons/fa6";
import { FaArrowTrendDown } from "react-icons/fa6";

import { Bar } from "react-chartjs-2";
import { Line } from "react-chartjs-2";

function ChartTotalRevenue({ orders }) {
  const [chartFormatLine, setChartFormatLine] = useState("year");
  const [totalRevenue, setTotalRevenue] = useState({}); //increase/reduce
  const [rate, setRate] = useState(0); //increase/reduce

  const [now, setNow] = useState(new Date());
  useEffect(() => {
    console.log(now?.getMonth());
    console.log(now?.getFullYear());
  }, []);
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  const optionsLine = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    stacked: false,
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
        text: "The chart above shows the total revenue",
        font: {
          size: 20,
        },
        position: "bottom",
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, ticks) {
            return value + " $";
          },
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, ticks) {
            return value * 100 + "%";
          },
        },
      },
    },
  };
  const labelsLine = [
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

  const [dataLine, setDataLine] = useState({
    labels: labelsLine,
    datasets: [
      {
        label: "Dataset 1",
        data: [1, 3, 5, 6, 6, 7, 5],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        yAxisID: "y",
      },
      {
        label: "Dataset 2",
        data: [4, 5, 6, 1, 5, 6, 7],
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        yAxisID: "y1",
      },
    ],
  });

  const caculaterTotalRevenueDataLine = async (detail_type, format_type) => {
    // console.log(detail_type);
    //  console.log(format_type);
    //2024, year
    // year, month, week

    const total_revenue_in_month = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const total_revenue_in_week = [0, 0, 0, 0, 0]; // 1-7 8-14 15-21 22-28 29-end
    const total_revenue_in_day = [0, 0, 0, 0, 0, 0, 0];
    orders?.map((order) => {
      if (order?.date) {
        const moonLanding = moment(order?.date, "hh:mm:ss DD/M/YYYY a");
        var monthLocal = moonLanding.format("M"); //4
        var yearLocal = moonLanding.format("YYYY"); // 2024
        var day = moonLanding.format("DD");

        if (format_type === "year") {
          if (yearLocal == detail_type?.year && order?.total_order) {
            total_revenue_in_month[monthLocal - 1] =
              total_revenue_in_month[monthLocal - 1] + order?.total_order;
          }
        } else if (format_type == "month") {
          if (
            yearLocal == detail_type?.year &&
            monthLocal == detail_type?.month &&
            order?.total_order
          ) {
            total_revenue_in_week[Math.ceil(day / 7) - 1] =
              total_revenue_in_week[Math.ceil(day / 7) - 1] +
              order?.total_order;
          }
        } else if (format_type == "week") {
          // week and detail_type  1,2,3,4,5

          if (
            yearLocal == detail_type?.year &&
            monthLocal == detail_type?.month &&
            day <= detail_type?.day &&
            day >= detail_type?.day - 7 &&
            order?.total_order
          ) {
            // 1-7 8-14 15-21 22-28 29-end
            total_revenue_in_day[1] =
              total_revenue_in_day[1] + order?.total_order;
            total_revenue_in_week[Math.ceil(day / 7) - 1] =
              total_revenue_in_week[Math.ceil(day / 7) - 1] +
              order?.total_order;
          }
        }
      }
    });
    if (format_type == "month") {
      return total_revenue_in_week;
    }

    return total_revenue_in_month;
  };

  const labelsLineMonth = ["1 - 7", "8 - 14", "15 - 21", "22 - 28", "29 - end"];

  const setOptionDataLine = async () => {
    if (chartFormatLine == "year") {
      const total_revenue_now = await caculaterTotalRevenueDataLine(
        { year: now?.getFullYear() },
        "year"
      );
      const total_revenue_befor = await caculaterTotalRevenueDataLine(
        { year: now?.getFullYear() - 1 },
        "year"
      );
      let total_now = total_revenue_now?.reduce((total, currentValue) => {
        return total + currentValue;
      });
      let total_befor = total_revenue_befor?.reduce((total, currentValue) => {
        return total + currentValue;
      });
    //   total_now = 100;
    //   total_befor = 20;

      setTotalRevenue({ total_now, total_befor });
      setRate(  (  (total_now - total_befor) / (total_befor)).toFixed(3) * 100);

      setDataLine({
        labels: labelsLine,
        datasets: [
          {
            label: now?.getFullYear() - 1,
            data: total_revenue_befor,
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
            yAxisID: "y",
          },
          {
            label: now?.getFullYear(),
            data: total_revenue_now,
            borderColor: "rgb(53, 162, 235)",
            backgroundColor: "rgba(53, 162, 235, 0.5)",
            yAxisID: "y",
          },
        ],
      });
    } else {
      const total_revenue_now = await caculaterTotalRevenueDataLine(
        { month: now?.getMonth() + 1, year: now?.getFullYear() },
        "month"
      );
      const total_revenue_befor = await caculaterTotalRevenueDataLine(
        { month: now?.getMonth(), year: now?.getFullYear() },
        "month"
      );
      const total_now = total_revenue_now?.reduce((total, currentValue) => {
        return total + currentValue;
      });
      const total_befor = total_revenue_befor?.reduce((total, currentValue) => {
        return total + currentValue;
      });
      setRate((total_now / total_befor) * 100);
      setTotalRevenue({ total_now, total_befor });

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
      setDataLine({
        labels: labelsLineMonth,
        datasets: [
          {
            label: month[now?.getMonth() - 1],
            data: total_revenue_befor,
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
            yAxisID: "y",
          },
          {
            label: month[now?.getMonth()],
            data: total_revenue_now,
            borderColor: "rgb(53, 162, 235)",
            backgroundColor: "rgba(53, 162, 235, 0.5)",
            yAxisID: "y",
          },
        ],
      });
    }
  };

  useEffect(() => {
    setOptionDataLine();
  }, [orders, chartFormatLine]);
  return (
    <div>
      <div className="mt-10 mb-5">
        <div className="mt-5 mb-5 ">
          <div className="flex justify-between items-center ">
            <div className="flex items-start  gap-5  ">
              <div className="flex flex-col">
                <div className=" font-bold">Current </div>
                <div>{totalRevenue?.total_now}$</div>
              </div>

              <div className="flex flex-col">
                <div className=" font-bold">Provious </div>
                <div>{totalRevenue?.total_befor}$</div>
              </div>
              <div className="flex flex-col">
                <div className=" font-bold">Rate</div>
                {  totalRevenue?.total_befor && totalRevenue?.total_befor < totalRevenue?.total_now ? (
                  <div className="flex gap-1">
                    <span className="border bg-green-500 text-white p-1 rounded-full">
                      {" "}
                      <FaArrowTrendUp size={15} />
                    </span>{" "}
                    <span className=" font-bold">{Math.abs(rate)}%</span>{" "}
                  </div>
                ) : (
                  <div className="flex gap-1">
                    <span className="border bg-red-500 text-white p-1 rounded-full">
                      {" "}
                      <FaArrowTrendDown size={15} />
                    </span>{" "}
                    <span className=" font-bold">{Math.abs(rate)}%</span>{" "}
                  </div>
                )}

                {/* <FaArrowTrendDown /> */}
              </div>
            </div>

            <div className=" flex items-center">
              <button
                onClick={() => {
                  setChartFormatLine("year");
                }}
                type="button"
                class={` ${
                  chartFormatLine == "year"
                    ? " border-gray-900"
                    : " border-gray-300"
                } "text-gray-900 hover:text-white border hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"`}
              >
                Year
              </button>
              <button
                onClick={() => {
                  setChartFormatLine("month");
                }}
                type="button"
                class={` ${
                  chartFormatLine == "month"
                    ? " border-gray-900"
                    : " border-gray-300"
                } "text-gray-900 hover:text-white border hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"`}
              >
                Month{" "}
              </button>

              {/* <button
                onClick={() => {
                  setChartFormatLine("week");
                }}
                type="button"
                class={` ${
                  chartFormatLine == "week"
                    ? " border-gray-900"
                    : " border-gray-300"
                } "text-gray-900 hover:text-white border hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"`}
              >
                Week
              </button> */}
            </div>
          </div>
          <div></div>
        </div>
        <Line options={optionsLine} data={dataLine} />
      </div>
    </div>
  );
}

export default ChartTotalRevenue;
