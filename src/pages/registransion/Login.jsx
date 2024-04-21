import { Link } from "react-router-dom";
import myContext from "../../context/data/myContext";
import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { IoMdArrowRoundBack } from "react-icons/io";
import "react-toastify/dist/ReactToastify.css";
import { auth, fireDB } from "../../fireabase/FirebaseConfig";
import { Timestamp, addDoc, collection, setDoc, doc } from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
} from "firebase/auth";
import Loader from "../../components/loader/Loader";
import { useNavigate } from "react-router-dom";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { Form, Formik } from "formik";
import { schema_login } from "./schemas";
import CustomInput from "./CustomInput";

function Login() {
  const onSubmit = async (values, actions) => {
    //  await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(values);
    const error = await signin(values);
    console.log(error);
    if (error) {
      actions.setFieldError("email", " ");
      actions.setFieldError("password", " ");
    }
    //actions.resetForm();
  };
  const toast_login = useRef(null);
  // const [showToast , setShowToast] = useState(false)
 
  useEffect(() => {
    // toast(
    //   "This is an admin account with administrative rights, you can use another account to log in if you want"
    // );
    // console.log("tepspspsps")
    // return()=>{ return toast.dismiss(" ")}
  }, []);

  const navigate = useNavigate();
  // const [email, setEmail] = useState("me@example.com");
  // const [password, setPassword] = useState("123456789");

  const context = useContext(myContext);
  const { loading, setLoading, find_user_from_db, setUser_infor } = context;

  const signinGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);

        const { _tokenResponse, user } = result;

        const user_firebase = {
          name: user.displayName,
          //uid: user.providerData[0].uid,
          email: user.email,
          time: Timestamp.now(),
          imageURL: user.photoURL,
        };
        // const token = credential.accessToken;
        // // The signed-in user info.
        const user_local = user;
        localStorage.setItem("user", JSON.stringify(user_local));
        setUser_infor(user_local);
        console.log(user);
        if (_tokenResponse.isNewUser) {
          const userRef = doc(fireDB, "users", user.uid);
          setDoc(userRef, user_firebase);
          toast.success("Signin Successfully", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }
        setLoading(false);
        navigate("/");
      })
      .catch((error) => {
        // Handle Errors here.
        console.log(error);
        // const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });

    //const provider = await GoogleAuthProvider(auth)
  };
  const signin = async (values) => {
    const auth = getAuth();
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(
        auth,
        values?.email,
        values?.password
      );
      localStorage.setItem("user", JSON.stringify(result.user));
      setUser_infor(result.user);

      // const user = auth.currentUser;

      toast.success("Signin Successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      navigate("/");
      //  window.location.href='/'
      setLoading(false);
      return false;
    } catch (error) {
      console.log(error);
      toast.error("Account or password is incorrect", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setLoading(false);
      return error;
    }
  };

  return (
    <div className=" flex justify-center items-center h-screen">
      {loading && <Loader />}
      <Formik
        initialValues={{
          email: "admin@gmail.com",
          password: "123456789",
          acceptedTos: false,
        }}
        validationSchema={schema_login}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form className=" bg-gray-800 px-10 py-10 rounded-xl ">
            <div className=" text-white flex items-center mb-4 ">
              <Link to={"/"} className="w-1/2">
                <IoMdArrowRoundBack size={25} />
              </Link>
              <h1 className="  -translate-x-1/2  text-center text-white text-xl font-bold">
                Login
              </h1>
            </div>
            <div  ref={toast_login} className="mb-3">
              <div
                id="toast-default"
                class="flex items-center w-full max-w-xs p-2 pl-0 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
                role="alert"
              >
               
                <div class="ms-3 text-sm font-normal">This is an admin account with administrative rights, you can use another account to log in </div>
                <button onClick={()=>{
                  toast_login?.current?.classList?.add("hidden")
                }}
                  type="button"
                  class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                  data-dismiss-target="#toast-default"
                  aria-label="Close"
                >
                  <span class="sr-only">Close</span>
                  <svg
                    class="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="mb-3">
              <CustomInput
                type="email"
                name="email"
                label="Email"
                className=" bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none"
                placeholder="Email"
              />
            </div>

            <div className="mb-3">
              <CustomInput
                type="password"
                label="Password"
                name="password"
                className="bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none"
                placeholder="Password"
              />
            </div>

            <div className="flex justify-center mb-4">
              <button
                onClick={() => {
                  alert(
                    "This function has not been completed yet, please sign in with google or account !"
                  );
                }}
                type="button"
                class=" flex items-center gap-2 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              >
                <FaFacebook /> Facebook
              </button>
              <button
                onClick={signinGoogle}
                type="button"
                class=" flex items-center gap-2 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              >
                <FaGoogle /> Google
              </button>
            </div>
            <div className=" flex justify-center mb-3">
              <button
                disabled={isSubmitting}
                type="submit"
                className=" disabled:bg-slate-200 bg-yellow-500 w-full text-black font-bold  px-2 py-2 rounded-lg"
              >
                Login
              </button>
            </div>
            <div>
              <h2 className="text-white">
                Don't have an account{" "}
                <Link className=" text-yellow-500 font-bold" to={"/signup"}>
                  Signup
                </Link>
              </h2>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Login;
