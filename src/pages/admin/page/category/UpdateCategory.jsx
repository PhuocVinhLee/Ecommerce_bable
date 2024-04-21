import React, { useContext, useEffect, useState } from "react";
import myContext from "../../../../context/data/myContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import CustomInput from "./CustomInput";

import { advancedSchemaUpdate } from "./schemas";
import { Form, Formik, useFormikContext } from "formik";
import CustomInputImage from "./CustomInputImage";
import Loader from "../../../../components/loader/Loader";
import {
  ref,
  uploadBytes,
  getStorage,
  listAll,
  getDownloadURL,deleteObject 
} from "firebase/storage";
import uuid from "react-uuid";
import { storage } from "../../../../fireabase/FirebaseConfig";

function AddCategory() {
  const context = useContext(myContext);
  const { updateCategory, get_OneCategorytData, setLoading, loading } = context;
  // const { setFieldValue } = useFormikContext()
  const navigate = useNavigate();
  const { id_category } = useParams();

  const [category, setCategory] = useState({});
  const getCategoryData = async () => {
    const category = await get_OneCategorytData(id_category);

    const category_local = {
      ...category,
      imageUrl: "",
      imageUrlLocal: category.imageUrl,
      // title: category?.title,
      // imageUrl: "",
      // imageUrlLocal: category.imageUrl,
    };
    setCategory(category_local);
  };
  useEffect(() => {
    getCategoryData();
  }, []);

  const Link_dashbroad = () => {
    navigate("/dashboard/categorydetail");
  };

  const onSubmit = async (values, actions) => {
    try {
      setLoading(true);
      console.log(values);
      const { imageUrlLocal, ...categoryLocal } = values;


      if (values.imageUrl?.name) {
        console.log(categoryLocal);
         const imaRef = ref(storage, `categorys/${uuid()}`);
        const spaceRef = await uploadBytes(imaRef, values.imageUrl);
        const url = await getDownloadURL(spaceRef.ref);
         const values_added_URLImage = { ...categoryLocal, imageUrl: url }; // url affter create image in Storge

        await handleUpdateCaterogy(values_added_URLImage);

        var arrStr = imageUrlLocal.split(/[/?]/);

        const [folder, ,nameImg] = arrStr[7].split(/[%F]/)
        
        const desertRef = ref(storage, `${folder+"/"+nameImg}`);
         await deleteObject(desertRef);

      } else {
        categoryLocal.imageUrl = imageUrlLocal;
        console.log(categoryLocal);

        await handleUpdateCaterogy(categoryLocal);
      }

      //  await handleUpdateCaterogy(values);
      // actions.resetForm();

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  const handleUpdateCaterogy = async (values) => {
    const respon = await updateCategory(values);

    if (respon) {
      Link_dashbroad();
    }
  };
  return (
    <>
      {loading && <Loader />}
      <div className=" relative  mt-5 flex items-center   justify-center sm:h-screen h-full">
        <Formik
          enableReinitialize={true}
          initialValues={category}
          validationSchema={advancedSchemaUpdate}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, values, errors }) => (
            <Form className=" w-full md:container p-3">
              <div className=" grid  grid-cols-1  gap-4   w-full ">
                <CustomInput
                  label="Title"
                  name="title"
                  type="text"
                  placeholder="Enter title"
                />
                
                <div>
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

                  <div>
                    {category?.imageUrlLocal && !values?.imageUrl ? (
                      <div>
                        <div>{category?.imageUrlLocal}</div>
                        <img
                          src={category?.imageUrlLocal}
                          className="h-20 w-20"
                          alt="none"
                          srcset=""
                        />
                      </div>
                    ) : (
                      <div className="mt-3 mb-5 ">
                        {values.imageUrl && (
                          <img
                            className="h-20 w-20"
                            src={URL.createObjectURL(values?.imageUrl)}
                            alt="none"
                            srcset=""
                          />
                        )}
                        {values.imageUrl && values.imageUrl.name}
                      </div>
                    )}
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
