import React, { useState, useContext } from "react";
import NavTitle from "./NavTitle";
import myContext from "../../../context/data/myContext";
const Price = () => {
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
    categorys
  } = context;

  const price_filter = [0,100,200,300,400,500,600,700,800,900]
  return (
    <div className="cursor-pointer ">
      <NavTitle title="Shop by Price" icons={true} />
      <div className="font-titleFont">
        <ul className="flex flex-col gap-4 text-sm lg:text-base ">
        <li
              
              className="border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center gap-2 hover:text-primeColor hover:border-gray-400 duration-300"
            >
               <input name="price"
                type="radio"
                value= "all"
                key="all" 
                onChange={(e) => setFilterPrice(e.target.value)}
              />
              {/* ${item.priceOne.toFixed(2)} - ${item.priceTwo.toFixed(2)} */}
              <p className="font-medium"> All price</p>
            </li>
          {price_filter.map((item, index) => (
            <li
              key={index}
              className="border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center gap-2 hover:text-primeColor hover:border-gray-400 duration-300"
            >
               <input name="price"
                type="radio"
                value={item}
                onChange={(e) => setFilterPrice(e.target.value)}
              />
              {/* ${item.priceOne.toFixed(2)} - ${item.priceTwo.toFixed(2)} */}
            { (price_filter.length > index+ 1) ? (item+"$" + " - " + price_filter[index+1] +"$"):
                   ("> " +item+"$") }
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Price;
