import React, { useContext, useEffect, useState } from "react";
import myContext from "../../../../context/data/myContext";
import { Link, useNavigate,useParams } from "react-router-dom";
import CustomInput from "./CustomInput";

import CustomTextarea from "./CustomTextarea";
import CustomSelect from "./CustomSelect";
import { advancedSchema } from "./schemas";
import { Form, Formik } from "formik";
function AddProduct() {
  const context = useContext(myContext);
  const {  addProduct,get_OneProductData,updateProduct, categorys, getCategorysData } =
    context;
  const navigate = useNavigate();

  const { id_product } = useParams();
  const Link_dashbroad = () => {
    navigate("/dashboard/productdetail");
  };
  const [product, setProduct] = useState({});
  const get_product = async()=>{
    const product_data = await get_OneProductData(id_product)
    setProduct(product_data)
 
  }
  useEffect(  () => {
    get_product();

  }, []);
  // useEffect(() => {
  //   setProducts({ ...products, category: categorys[0]?.id });
  // }, [categorys]);

  useEffect(() => {
    getCategorysData();
  }, []);
  const handleUpdateproduct = async (products) => {
    const respon = await updateProduct(products);
    if (respon) {
      Link_dashbroad();
    }
  };

  const onSubmit = async (values, actions) => {
    //  await new Promise((resolve) => setTimeout(resolve, 1000));
    await handleUpdateproduct(values);
    // actions.resetForm();
  };
  return (
    <>
      <div className=" relative  mt-5 flex items-center   justify-center sm:h-screen h-full">
        <Formik
          initialValues={product}
          enableReinitialize={true}
          validationSchema={advancedSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, values }) => (
            <Form className=" w-full md:container p-3">
              <div className=" grid sm:grid-cols-2 grid-cols-1  gap-4   w-full ">
                <CustomInput
                  label="Title"
                  name="title"
                  type="text"
                  placeholder="Enter title"
                />
                <CustomInput
                  label="Price"
                  name="price"
                  type="text"
                  placeholder="Enter price"
                />

                <CustomInput
                  label="Inventory Quantity"
                  name="inventory_quantity"
                  type="text"
                  placeholder="Enter Inventory Quantity"
                />
                <CustomSelect
                  label="Category"
                  name="category"
                  placeholder="Please select a category"
                  // value={categorys[0]?.id}

                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value=""></option>
                  {categorys.map((item, index) => {
                    return (
                      <option key={index} value={item.id}>
                        {item.title}
                      </option>
                    );
                  })}
                </CustomSelect>

                <CustomTextarea
                  label="Description"
                  type="text"
                  cols="20"
                  rows="7"
                  name="description"
                  placeholder="Enter description"
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

export default AddProduct;
