import React, { useContext, useEffect } from "react";
import Navbav from "../navbar/Navbav";
import Footer from "../footer/Footer";
import Chat from "../Chat/Chat";
import UserChat from "../Chat/UserChat";
import myContext from "../../context/data/myContext";

function Layout({ children }) {
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
    getMessageData,
    message,
    messages,
    createMessageForAdmin,
    find_Messge,
    setMessage,
    user,
    userChatting,
    setUserChatting,
    updateMessage,
    user_infor,
  } = context;

  return (
    <div className=" bg-white dark:bg-gray-900 dark:text-white">
      <Navbav></Navbav>

      <div className="content">{children}</div>

      {user_infor?.uid ? (
        <div>
          {user_infor?.email == "admin@gmail.com" ? (
            <Chat></Chat>
          ) : (
            <UserChat></UserChat>
          )}
        </div>
      ) : (
        ""
      )}

      <Footer></Footer>
    </div>
  );
}

export default Layout;
