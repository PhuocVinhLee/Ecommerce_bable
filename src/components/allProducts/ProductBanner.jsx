import React, { useEffect, useState, useContext } from "react";
import { BsGridFill } from "react-icons/bs";
import { ImList } from "react-icons/im";
import { GoTriangleDown } from "react-icons/go";
import myContext from "../../context/data/myContext";
import { RiMenuUnfoldLine } from "react-icons/ri";

const ProductBanner = (props) => {
  const context = useContext(myContext);
  const {
    mode,
    searchkey,
    setSearchkey,
    filterType,
    setFilterType,
    filterPrice,
    setFilterPrice,
    product,
    categorys,
    show,
    setShow,
    sortBy,
    setsortBy,
  } = context;
  useEffect(() => {
    console.log(props);
  });

  return (
    <div className=" w-full flex flex-row items-center justify-between md:justify-end">
      {/* =========================================================
                            Left Part Start here
        ======================================================== */}

      {/* <div className="flex items-center gap-4 border">
        <span
          className={`${
            girdViewActive
              ? "bg-primeColor text-white"
              : "border-[1px] border-gray-300 text-[#737373]"
          } w-8 h-8 text-lg flex items-center justify-center cursor-pointer gridView`}
        >
          <BsGridFill />
        </span>
        <span
          className={`${
            listViewActive
              ? "bg-primeColor text-white"
              : "border-[1px] border-gray-300 text-[#737373]"
          } w-8 h-8 text-base flex items-center justify-center cursor-pointer listView`}
        >
          <ImList />
        </span>
      </div> */}
      {/* =========================================================
                            Left Part End here
        ======================================================== */}
      {/* =========================================================
                            Right Part STart here
        ======================================================== */}
      <span
        onClick={props.toggloMenu}
        className=" text-2xl text-smallTextColor md:hidden cursor-pointer"
      >
        <RiMenuUnfoldLine />
        {/* RiMenuUnfoldLine */}
      </span>
      <div className="flex sm:items-center gap-2 md:gap-6  md:mt-0 sm:flex-row flex-col items-end  ">
        <div className="flex items-center gap-2  relative">
          <label className="block">Sort by:</label>
          <select
            onChange={(e) => setsortBy(e.target.value)}
            // onChange={(e) => setSelected(e.target.value)}
            id="countries"
            className="   text-black w-32 md:w-52 border-[1px] border-gray-200 py-1 px-4 cursor-pointer  block dark:placeholder-gray-400 appearance-none focus-within:outline-none focus-visible:border-primeColor"
          >
            <option value="best_sellers">Best Sellers</option>
            <option value="start_number">Start Number</option>
            <option value="latest_product">Latest Product</option>
            <option value="price">Price</option>
          </select>
          <span className="absolute text-sm right-2 md:right-4 top-2.5">
            <GoTriangleDown />
          </span>
        </div>
        <div className="flex items-center gap-2 relative">
          <label className="block">Show:</label>
          <select
            onChange={(e) => setShow(e.target.value)}
            id="countries"
            className=" text-black w-16 md:w-20 border-[1px] border-gray-200 py-1 px-4 cursor-pointer  block dark:placeholder-gray-400 appearance-none focus-within:outline-none focus-visible:border-primeColor"
          >
            <option value="all">All</option>
            <option value="12">12</option>
            <option value="24">24</option>
            <option value="36">36</option>
            <option value="48">48</option>
          </select>
          <span className="absolute text-sm right-3 top-2.5">
            <GoTriangleDown />
          </span>
        </div>
      </div>
      {/* =========================================================
                            Right Part End here
        ======================================================== */}
    </div>
  );
};

export default ProductBanner;
