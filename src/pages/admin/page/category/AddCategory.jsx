import React, { useContext } from "react";
import myContext from "../../../../context/data/myContext";
import { Link,useNavigate  } from "react-router-dom";
import CustomInput from "./CustomInput";

import { advancedSchema } from "./schemas";
import { Form, Formik } from "formik";

function AddCategory() {
  const context = useContext(myContext);
  const {  addCategory } = context;
  const navigate = useNavigate();
  const Link_dashbroad = () =>{
    navigate("/dashboard/categorydetail")
  }
  const onSubmit = async (values, actions) => {
    //  await new Promise((resolve) => setTimeout(resolve, 1000));
    await handleAddCategory(values);
    // actions.resetForm();
  };
  const handleAddCategory =  async (values)=>{
    const respon = addCategory(values);
    if(respon){
       // navigate("/dashboard/categorydetail")
    }
  }
  return (
   
    <>
    <div className=" relative  mt-5 flex items-center   justify-center sm:h-screen h-full">
      <Formik
        initialValues={{
          title: "test product",
         
          imageUrl:
            "https://img.freepik.com/premium-psd/cosmetic-product_986960-1496.jpg",
        
       
        }}
        validationSchema={advancedSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, values }) => (
          <Form className=" w-full md:container p-3">
            <div className=" grid  grid-cols-1  gap-4   w-full ">
              <CustomInput
                label="Title"
                name="title"
                type="text"
                placeholder="Enter title"
              />
            
              <div>
                <CustomInput
                  label="imageurl"
                  name="imageUrl"
                  type="text"
                  placeholder="Enter imageurl"
                />
                <div className="mt-3 sm:max-w-[200px] w-[110px] h-[80px]  sm:max-h-[50px]">
                  <img src={values.imageUrl} alt="" srcset="" />
                </div>
              </div>
            </div>

            <div className=" w-full gap-2  flex items-center my-3 ">
              <button
                onClick={Link_dashbroad}
                className="  bg-primary/40 hover:bg-primary w-[90px] font-bold  px-2 py-2 rounded-lg"
              >
                Go back
              </button>

              <button   className="w-[150px]   bg-primary/40 hover:bg-primary font-bold  px-2 py-2 rounded-lg" disabled={isSubmitting} type="submit">
                Submit
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  </>
   
  );
}

export default AddCategory;
