import React, {
  useState,
  useRef,
  useContext,
  useEffect,
  useMemo,
  Fragment,
} from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import myContext from "../../context/data/myContext";

function Chat() {
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
    getAllMesaageForAdmin,
    AllMessageFromDb,
    user_from_db
  } = context;
  const [toggleChatbox, setToggleChatbox] = useState(false);
  const toggleChatboxRef = useRef(null);
  const handleTogole = () => {
    console.log("tooggle");
    toggleChatboxRef.current.classList.toggle("hidden");
  };

  useEffect(() => {
    if (userChatting?.id) {
      getMessageData();
    } else {
      getAllMesaageForAdmin();
    }
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
  const chatEndRef = useRef(null);
  const scrollEnd = () => {
    console.log("scrolll");
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollEnd();
  }, [messages]);

  const sendMessage = async () => {
    await updateMessage(true);
    setMessage("");
  };

  const converttimeSap = (time) => {
    const fireBaseTime = new Date(
      time?.seconds * 1000 + time?.nanoseconds / 1000000
    );
    const date = fireBaseTime.toDateString();
    const atTime = fireBaseTime.toLocaleTimeString();
    return { date: date, time: atTime };
  };
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
        class="hidden fixed bottom-16 right-0 sm:w-[500px] w-full h-[85%] sm:h-[80%]  z-[500]  "
      >
        <div class="  flex-1 p:5 sm:p-3 sm:justify-start justify-between  flex flex-col w-full  h-full bg-white  dark:bg-black dark:text-white shadow-lg rounded">
          <div class="   flex flex-col gap-y-1  py-0 border-b-2  border-gray-200">
            <div class=" max-w-[700px] overflow-x-auto gap-1 flex items-center space-x-2 border-b-2 border-gray-200 ">
              {user?.map((item, index) => {
                return (
                  <div className="sm:p-0 p-1">
                    {item.email != "admin@gmail.com" && (
                      <div
                        onClick={() => {
                          setUserChatting(item);
                          handdleAddMessage(item.id);
                        }}
                        key={index}
                        class="relative min-w-[50px] border rounded-full "
                      >
                        <span class="absolute text-green-500 right-0 bottom-0">
                          <input className=" hidden" type="text" />
                          <svg className="" width="20" height="20">
                            <circle
                              cx="8"
                              cy="8"
                              r="8"
                              fill="currentColor"
                            ></circle>
                          </svg>
                        </span>
                        {/* <div>{item?.imageURL}</div> */}
                        {/* <img src={item?.imageURL}/> */}
                        <img
                           src={item?.imageURL}
                    
                          alt="none"
                          class=" min-w-16  min-h-16 rounded-full"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {userChatting?.id ? (
            <>
              <div>
                {userChatting?.id && (
                  <div class="  flex sm:items-center justify-between py-0 border-b-2 border-gray-200 pb-1">
                    <div class="relative flex items-center space-x-4 sm:p-2">
                      <div
                        onClick={() => {
                          setUserChatting({});
                        }}
                      >
                        {" "}
                        <IoMdArrowRoundBack />
                      </div>
                      <div class="relative border rounded-full">
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
                          src={userChatting?.imageURL}
                          alt="sc"
                          class=" w-14  h-14 rounded-full"
                        />
                      </div>
                      <div class="flex flex-col leading-tight">
                        <div class="text-2xl mt-1 flex items-center">
                          <span class=" mr-3 text-[17px]">
                            {userChatting?.name}
                          </span>
                        </div>
                        {/* <span class="text-lg text-gray-600">Junior Developer</span> */}
                      </div>
                    </div>
                    <div class="flex items-center space-x-2">
                      <button
                        type="button"
                        class="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          class="h-6 w-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          ></path>
                        </svg>
                      </button>
                      <button
                        type="button"
                        class="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          class="h-6 w-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          ></path>
                        </svg>
                      </button>
                      <button
                        type="button"
                        class="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          class="h-6 w-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div
                id="messages"
                class="  h-2/3 flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
              >
                {messages?.message?.map((message, index) => {
                  return (
                    <Fragment key={index}>
                      {message.isAdmin ? (
                        <Fragment>
                          <div class="chat-message">
                            <div class="flex items-end justify-end">
                              <div class="flex flex-col  text-xs max-w-xs mx-2 order-1 items-end">
                                <div>
                                  <span class="px-4 py-2 rounded-lg inline-block  rounded-br-none bg-blue-600 text-white ">
                                    {message?.text}
                                  </span>
                                </div>

                                <div>
                                  {converttimeSap(message.time).date +
                                    " " +
                                    converttimeSap(message.time).time}
                                </div>
                              </div>
                              <img
                               src={user_from_db?.imageURL}
                                alt="My profile"
                                class="w-6 h-6 rounded-full border order-2"
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
                                {converttimeSap(message.time).date +
                                  " " +
                                  converttimeSap(message.time).time}
                              </div>
                              <img
                                src={userChatting?.imageURL}
                                alt={userChatting?.name}
                                class="w-6 h-6 rounded-full order-1 border"
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
                    class="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 bg-gray-200  px-1 rounded-md "
                  />
                  <div class=" right-0 items-center inset-y-0 flex">
                    {/* <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
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
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    ></path>
                  </svg>
                </button>
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
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
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    ></path>
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                </button>
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
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
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </button> */}
                    <button
                      onClick={sendMessage}
                      type="button"
                      class="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
                    >
                      <span class="font-bold">Send</span>
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
            </>
          ) : (
            <div className=" overflow-auto p-3 ">
              {AllMessageFromDb?.map((message) => {
                return ( message.message.length != 0 && 
                  <div
                    onClick={() => {
                      setUserChatting({
                        id: message?.id,
                        imageURL: user?.find((user) => {
                          return user.id == message.id;
                        })?.imageURL,
                      });
                      // handdleAddMessage(message?.id)
                    }}
                    class="  flex sm:items-center justify-between py-0 border-b-2 border-gray-200 pb-1"
                  >
                    <div class="relative flex items-center space-x-4">
                      <div className="flex  flex-col items-center">
                        <div class="relative border rounded-full">
                        <div>{console.log(user)}</div>
                          <img
                            src={
                              user?.find((user) => {
                                return user.id == message.id;
                              })?.imageURL
                            }
                            alt="none"
                            class="w-12 sm:w-12 h-12 sm:h-12 rounded-full"
                          />
                        </div>
                      </div>

                      <div class="flex flex-col leading-tight">
                        <div className="text-[20px]">
                          {
                            user?.find((user) => {
                              return user.id == message.id;
                            })?.name
                          }
                        </div>
                        <div class="text-2xl m flex items-center">
                          <span class=" mr-3 text-[17px] font-bold line-clamp-1 max-w-20">
                            {
                              message?.message[message?.message?.length - 1]
                                ?.text
                            }
                          </span>
                        </div>
                        {/* <span class="text-lg text-gray-600">Junior Developer</span> */}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;
