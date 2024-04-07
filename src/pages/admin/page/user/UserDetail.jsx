import React, { useContext, useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import myContext from "../../../../context/data/myContext";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { FaUser, FaCartPlus } from "react-icons/fa";
import { BiCategory } from "react-icons/bi";
import { AiFillShopping, AiFillPlusCircle, AiFillDelete } from "react-icons/ai";
import { Link,useNavigate  } from "react-router-dom";
function UserDetail() {

    const navigate = useNavigate();
    const context = useContext(myContext);
    const { mode, product, categorys,edithandle, updateProduct, deleteProduct, order ,user} =
      context;
      
  return (
    <div>
        
                            <div className="relative overflow-x-auto mb-10">
                                <h1 className=' text-center mb-5 text-3xl font-semibold underline' style={{ color: mode === 'dark' ? 'white' : '' }}>User Details</h1>
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-black uppercase bg-gray-200 " style={{ backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : '', color: mode === 'dark' ? 'white' : '', }} >
                                        <tr>
                                            <th scope="col" className="px-6 py-3">
                                                S.No
                                            </th>

                                            <th scope="col" className="px-6 py-3">
                                                Name
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Email
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Uid
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Date
                                            </th>
                                        </tr>
                                    </thead>
                                    {user.map((item, index) => {
                                        const {name,uid,email,date} = item;
                                        return (
                                            <tbody key={index} >
                                                <tr className="bg-gray-50 border-b  dark:border-gray-700" style={{ backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : '', color: mode === 'dark' ? 'white' : '', }} >
                                                    <td className="px-6 py-4 text-black " style={{ color: mode === 'dark' ? 'white' : '' }}>
                                                        {index + 1}.
                                                    </td>
                                                    <td className="px-6 py-4 text-black " style={{ color: mode === 'dark' ? 'white' : '' }}>
                                                        {name}
                                                    </td>
                                                    <td className="px-6 py-4 text-black " style={{ color: mode === 'dark' ? 'white' : '' }}>
                                                        {email}
                                                    </td>
                                                    <td className="px-6 py-4 text-black " style={{ color: mode === 'dark' ? 'white' : '' }}>
                                                        {uid}
                                                    </td>
                                                    <td className="px-6 py-4 text-black " style={{ color: mode === 'dark' ? 'white' : '' }}>
                                                        {date}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        )
                                    })}

                                </table>
                            </div>
                       
    </div>
  )
}

export default UserDetail
