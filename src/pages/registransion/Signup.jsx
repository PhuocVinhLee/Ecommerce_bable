import { useContext, useState } from 'react';
import { Link } from 'react-router-dom'
import myContext from '../../context/data/myContext';
import { toast } from 'react-toastify';
import { IoMdArrowRoundBack } from "react-icons/io";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, fireDB } from '../../fireabase/FirebaseConfig';
import { Timestamp, addDoc, doc, setDoc,collection } from 'firebase/firestore';
import Loader from '../../components/loader/Loader';
import { useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
import { schema_signup } from "./schemas";
import CustomInput from "./CustomInput";
import {
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
  } from "firebase/auth";

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const navigate = useNavigate();
  const context = useContext(myContext);
  const { loading, setLoading ,find_user_from_db, setUser_infor} = context;

    const signup = async (values) => {
   
       
        setLoading(true)
        // if (name === "" || email === "" || password === "") {
        //     return toast.error("All fields are required")
        // }

        try {
            const users = await createUserWithEmailAndPassword(auth, values.email, values.password);

            const user = {
                name: values.username,
            //    uid: users.user.uid,
                email: users.user.email,
                time : Timestamp.now(),
                imageURL: users.user.photoURL

            }
         
            const userRef = doc(fireDB, "users", users.user.uid)
            await setDoc(userRef, user);

            await signin(values)
            toast.success("Signup Succesfully")
            setName("");
            setEmail("");
            setPassword("");
            setLoading(false)
            navigate("/");
            
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    const signin = async (values) => {
        const auth = getAuth();
        setLoading(true);
        try {
          const result = await signInWithEmailAndPassword(auth, values?.email, values?.password);
          localStorage.setItem("user", JSON.stringify(result.user));
          setUser_infor(result.user)
         
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
          console.log(error)
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
    const onSubmit = async (values, actions) => {
        //  await new Promise((resolve) => setTimeout(resolve, 1000));
          console.log(values)
        const error =   await signup(values)
    //   console.log(error)
        // actions.setFieldError("email"," " );
        // actions.setFieldError("password"," " );
        //actions.resetForm();
        };
    return (
        <div className=" flex justify-center items-center h-screen">
        {loading && <Loader />}
        <Formik
        initialValues={{   username: "", email: "", password: "",confirmPassword: "", acceptedTos: false }}
        validationSchema={schema_signup}
        onSubmit={onSubmit}
      >{({ isSubmitting }) => (
        <Form className=" bg-gray-800 px-10 py-10 rounded-xl ">
          <div className=" text-white flex items-center mb-4 ">
            <Link to={"/"} className="w-1/2">
            <IoMdArrowRoundBack  size={25} />
            </Link>
            <h1 className="  -translate-x-1/2  text-center text-white text-xl font-bold">
              Signup
            </h1>
          </div>

          <div className="mb-3">
          <CustomInput
              type="username"
              name="username"
             label="User name"
              className=" bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none"
              placeholder="User name"
            />
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
          <div className="mb-3">
          <CustomInput
              type="password"
              label="Confirm password"
            name="confirmPassword"
              className="bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none"
              placeholder="confirmPassword"
            />
          </div>
  
        
          <div className=" flex justify-center mb-3">
            <button   disabled={isSubmitting} type="submit"
              
              className=" disabled:bg-slate-200 bg-yellow-500 w-full text-black font-bold  px-2 py-2 rounded-lg"
            >
             Signup
            </button>
          </div>
          <div>
            <h2 className="text-white">
              Don't have an account{" "}
              <Link className=" text-yellow-500 font-bold" to={"/login"}>
                Login
              </Link>
            </h2>
          </div>
        </Form>
    )}
        </Formik>
      </div>
    )
}

export default Signup