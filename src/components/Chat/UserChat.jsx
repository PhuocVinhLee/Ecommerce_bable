import React, {
  useState,
  useRef,
  useContext,
  useEffect,
  useMemo,
  Fragment,
} from "react";
import myContext from "../../context/data/myContext";


function UserChat() {
  const context = useContext(myContext);
  const {user_from_db,
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
  const [toggleChatbox, setToggleChatbox] = useState(false);
  const toggleChatboxRef = useRef(null);
  const handleTogole = () => {
    console.log("tooggle");
    toggleChatboxRef.current.classList.toggle("hidden");
    handdleAddMessage(user_infor.uid);
    console.log(user_infor)
    setUserChatting({ id: user_infor.uid });
  };

  useEffect(() => {
    getMessageData();
    console.log("okekekekekekekekekekekekek");
  }, [userChatting]);

  const handdleAddMessage = async (id_user_chating) => {
    const check_Message = await find_Messge(id_user_chating);
    if (!check_Message) {
      createMessageForAdmin(id_user_chating);
    }
    //createMessageForAdmin(id_user_chating);
  };
  const handdleMessage = (e) => {
    setMessage(e.target.value);
  };

  const sendMessage = async () => {
    await updateMessage(false);
    setMessage("");
  };

  const chatEndRef = useRef(null);
  const scrollEnd = () => {
    console.log("scrolll");
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollEnd();
  }, [messages]);

  
  const converttimeSap = (time)=>{
  
    const fireBaseTime = new Date(
      time?.seconds * 1000 + time?.nanoseconds / 1000000,
    );
    const date = fireBaseTime.toDateString();
    const atTime = fireBaseTime.toLocaleTimeString();
    return   {date: date, time: atTime}
  }
  // onClick={() => {
  //     setUserChatting(item);
  //     handdleAddMessage(item.id);
  //   }}
  return (
    <div>
      <div class="fixed bottom-0 right-0 mb-4 mr-0">
        <button
          onClick={handleTogole}
          id="open-chat"
          class="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          Chat 
        </button>
      </div>
      <div
        ref={toggleChatboxRef}
        class="hidden fixed bottom-16 right-0 sm:w-[500px] w-full h-[80%] border border-red-800 sm:h-[80%]  z-[500] "
      >
        <div class="  flex-1 p:5 sm:p-3 sm:justify-start justify-between  flex flex-col w-full h-full bg-white  dark:bg-black dark:text-white shadow-lg rounded">
          <div class="   flex flex-col gap-y-1  py-0 border-b-2 border-gray-200">
            <div class=" max-w-[700px] overflow-x-auto gap-1 flex items-center space-x-2"></div>
            <div>
              <div class="  flex sm:items-center justify-between py-0 border-b-2 border-gray-200">
                <div class="relative flex items-center space-x-4 mb-2">
                  <div class="relative">
                    <span class="absolute text-green-500 right-0 bottom-0">
                      <svg width="20" height="20">
                        <circle
                          cx="8"
                          cy="8"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </svg>
                    </span>
                    <img
                     src="https://people.com/thmb/v8z8cdgaJbFvIKWias2zP-zm0Ek=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(216x0:218x2)/luke-graham-435-80665206baa54221bab2bae5cca57b86.jpg"
                      alt=""
                      class="w-10 sm:w-16 h-10 sm:h-16 rounded-full"
                    />
                  </div>
                  <div class="flex flex-col leading-tight">
                    <div class="text-2xl mt-1 flex items-center">
                      <span class="text-gray-700 mr-3 ">
                        Admin
                      </span>
                    </div>
                    {/* <span class="text-lg text-gray-600">Junior Developer</span> */}
                  </div>
                </div>
              
              </div>
            </div>
          </div>

          <div
            id="messages"
            class=" h-3/4 flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
          >
            {messages?.message?.map((message, index) => {
              return (
                <Fragment key={index}>
                  {!message.isAdmin ? (
                    <Fragment>
                      <div class="chat-message">
                        <div class="flex items-end justify-end">
                          <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                            <div>
                              <span class="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
                                {message?.text}
                              </span>
                            </div>
                            { converttimeSap(message.time).date + " "+ converttimeSap(message.time).time}
                          </div>
                          <img
                            src={user_from_db.imageURL}
                            alt="My profile"
                            class="w-6 h-6 rounded-full order-2"
                          />
                         
                        </div>
                      </div>
                    </Fragment>
                  ) : (
                    <Fragment>
                      <div class="chat-message">
                        <div class="flex items-end">
                          <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                            <div>
                              <span class="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
                                {message?.text}
                              </span>
                            </div>
                            <div>
                        { converttimeSap(message.time).date + " "+ converttimeSap(message.time).time}
                       </div>
                          </div>
                          <img
                           src="https://people.com/thmb/v8z8cdgaJbFvIKWias2zP-zm0Ek=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(216x0:218x2)/luke-graham-435-80665206baa54221bab2bae5cca57b86.jpg"
                            alt="My profile"
                            class="w-6 h-6 rounded-full order-1"
                          />
                        </div>
                      </div>
                    </Fragment>
                  )}
                    <div ref={chatEndRef}></div>
                </Fragment>
              );
            })}
          </div>
          <div class="  border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
            <div class="relative flex flex-row gap-1">
              {/* <span class="absolute inset-y-0 flex items-center">
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    class="h-6 w-6 text-gray-600"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    ></path>
                  </svg>
                </button>
              </span> */}
              <input
                value={message}
                onChange={handdleMessage}
                type="text"
                placeholder="Write your message!"
                class="   w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 px-1 bg-gray-200 rounded-md"
              />
              <div class=" items-center inset-y-0 flex">                                                                      
                <button
                  onClick={sendMessage}
                  type="button"
                  class="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
                >
                  <span class="font-bold"></span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    class="h-6 w-6 ml-2 transform rotate-90"
                  >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserChat;
