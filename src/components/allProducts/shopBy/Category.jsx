import React, { useState, useContext } from "react";

// import { FaPlus } from "react-icons/fa";
import { ImPlus } from "react-icons/im";
import NavTitle from "./NavTitle";
import myContext from "../../../context/data/myContext";



const Category = () => {
  const [showSubCatOne, setShowSubCatOne] = useState(true);

 
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





  return (
    <div className="md:w-full  ">
      <div onClick={()=>{setShowSubCatOne(!showSubCatOne)}}>
      <NavTitle  title="Shop by Category" icons={showSubCatOne}  />
      </div>
      {showSubCatOne && (
        <div>
        <ul className="flex flex-col gap-4 text-sm lg:text-base ">
        <li
            
              className="border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center gap-2 hover:text-primeColor hover:border-gray-400 duration-300"
            >
              
              <input name="category"
                type="radio"
                value="all"
                key="all"
                onChange={(e) => setFilterType(e.target.value)}
                
              />
              <p className="font-medium">All category</p>
              {/* {item.icons && (
                <span
                  
                  className="text-[10px] lg:text-xs cursor-pointer text-gray-400 hover:text-primeColor duration-300"
                >
                  <ImPlus />
                </span>
              )} */}
            </li>
          {categorys.map((item) => (
            <li
              key={item._id}
              className="border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center gap-2 hover:text-primeColor hover:border-gray-400 duration-300"
            >

              <input name="category"
                type="radio"
                value={item.id}
                onChange={(e) => setFilterType(e.target.value)}
                
              />
              <p className="font-medium">{item.title}</p>
              {/* {item.icons && (
                <span
                  
                  className="text-[10px] lg:text-xs cursor-pointer text-gray-400 hover:text-primeColor duration-300"
                >
                  <ImPlus />
                </span>
              )} */}
            </li>
          ))}
          
        </ul>
      </div>
      )}
    </div>
  );
};

export default Category;
