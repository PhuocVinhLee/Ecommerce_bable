import React, { useContext, useEffect } from "react";
import myContext from "../../../../context/data/myContext";
import { Link, useNavigate } from "react-router-dom";
import CustomInput from "./CustomInput";

import { advancedSchema } from "./schemas";
import { Form, Formik } from "formik";
import CustomInputImage from "./CustomInputImage";
import Loader from "../../../../components/loader/Loader";
import {
  ref,
  uploadBytes,
  getStorage,
  listAll,
  getDownloadURL,
} from "firebase/storage";
import uuid from "react-uuid";
import { storage } from "../../../../fireabase/FirebaseConfig";

function AddCategory() {
  const context = useContext(myContext);
  const { addCategory,loading,setLoading } = context;
  const navigate = useNavigate();
  const Link_dashbroad = () => {
    navigate("/dashboard/categorydetail");
  };
  const onSubmit = async (values, actions) => {
    try {
      setLoading(true)

      console.log(values)
      const imaRef = ref(storage, `files/${uuid()}`);
      const spaceRef = await uploadBytes(imaRef, values.imageUrl);
      const url = await getDownloadURL(spaceRef.ref);
      const values_added_URLImage = { ...values, imageUrl: url };
      console.log(values_added_URLImage)
     await handleAddCategory(values_added_URLImage);


      // actions.resetForm();
    } catch (error) {
      console.log(error);
      setLoading(false)
    }

    setLoading(false)
  };

  // const getdataIMG = async () => {
  //   const repon = await listAll(ref(storage, "files/"));
  //   console.log(repon.items);
  //   const url = await getDownloadURL(repon.items[0]);
  //   console.log(url);
  // };
  // useEffect(() => {
  //   getdataIMG();
  // }, []);
  const handleAddCategory = async (values) => {
    const respon = addCategory(values);
    if(respon){
       navigate("/dashboard/categorydetail")
    }
  };
  return (
    <>
      {loading && <Loader  />}
      <div className="  relative  mt-5 flex items-center container   justify-center sm:h-screen h-full">
        <Formik
          initialValues={{
            title: "test product",

            imageUrl:
              "",
          
          }}
          validationSchema={advancedSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form className=" w-full md:container p-3">
              <div className="    grid  grid-cols-1  gap-4   w-full ">
                <CustomInput
                  label="Title"
                  name="title"
                  type="text"
                  placeholder="Enter title"
                />

                {/* <div>
                  <CustomInput
                    label="imageurl"
                    name="imageUrl"
                    type="text"
                    placeholder="Enter imageurl"
                  />
                  <div className="mt-3 sm:max-w-[200px] w-[110px] h-[80px]  sm:max-h-[50px]">
                    <img src={values.imageUrl} alt="" srcset="" />
                  </div>
                </div> */}
                <div >
                  <CustomInputImage
                    label="Imageurl"
                    name="imageUrl"
                    type="file"
                    multiple="true"
                    placeholder="Enter imageurl"
                    accept="image/*" 
                    
                    // onChange={(event) => {
                    //   // const files = event.target.files;
                    //   //  let myFiles =Array.from(files);
                    //    setFieldValue("imageUrl1", "test");
                    // // console.log(myFiles)
                    // }}
                    //   onChange={(event) => {
                    //     setFieldValue("imageUrl1", event.currentTarget.files)
                    // }}
                  />
                  <div className="mt-3 mb-5 ">
                    {values.imageUrl && (
                      <img
                        className="h-20 w-20"
                        src={URL.createObjectURL(values?.imageUrl)}
                        alt="none"
                        srcset=""
                      />
                    )}
                    {values.imageUrl && (values.imageUrl.name)}
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

                <button
                  className="w-[150px]   bg-primary/40 hover:bg-primary font-bold  px-2 py-2 rounded-lg"
                  disabled={isSubmitting}
                  type="submit"
                >
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
