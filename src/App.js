import React,{useEffect} from "react";
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./pages/home/Home";
import Order from "./pages/order/Order";
import Cart from "./pages/cart/Cart";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import NoPage from "./pages/nopage/NoPage";
import MyState from "./context/data/myState";
import Signup from "./pages/registransion/Signup";
import Login from "./pages/registransion/Login";
import ProductInfo from "./pages/productinfo/ProductInfo";
import Reviews from "./pages/reviews/Reviews";
import AddProduct from "./pages/admin/page//product/AddProduct";
import UpdateProduct from "./pages/admin/page/product/UpdateProduct";
import UpdateCategory from "./pages/admin/page/category/UpdateCategory";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Allproducts from "./pages/allproducts/Allproduct";
import AddCategory from "./pages/admin/page/category/AddCategory";
import ProductDetail from "./pages/admin/page/product/ProductDetail";
import UserDetail from "./pages/admin/page/user/UserDetail";
import CategoryDetail from "./pages/admin/page/category/CategoryDetail";
import OrderDetail from "./pages/admin/page/order/OrderDetail";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";



import AOS from "aos";
import "aos/dist/aos.css";


export default function App() {

  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []); 
  return (
    <PayPalScriptProvider options={{ clientId: "AXSfB-xVvhHyOUxPWvcdS88jZ2_Y8194nj2U9nQdE-I72zbs7vI-I2WzviSlF51aGIlXTso1nj9-d4-w" }}> 
    <MyState>
      <ToastContainer icon={false} />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
         
          <Route
            path="/order"
            element={
              <ProtectedRoutes>
                {" "}
                <Order />{" "}
              </ProtectedRoutes>
            }
          />
          <Route path="/cart" element={<Cart />} />
         
          <Route
            path="/dashboard"
            element={
              <ProtectedRoutesForAdmin>
                {" "}
                <Dashboard />{" "}
              </ProtectedRoutesForAdmin>
            }
          >

            <Route path="productdetail" element={<ProductDetail />} />
            <Route path="userdetail" element={<UserDetail />} />
            <Route path="categorydetail" element={<CategoryDetail />} />
            <Route path="orderdetail" element={<OrderDetail />} />
            
          </Route>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/productinfo/:id" element={<ProductInfo />} />
          <Route path="/reviews/:id/:id_order" element={<Reviews />} />
          <Route path="/allproducts" element={<Allproducts />} />
          <Route
            path="/addproduct"
            element={
              <ProtectedRoutesForAdmin>
                <AddProduct />
              </ProtectedRoutesForAdmin>
            }
          />
          <Route
            path="/updateproduct/:id_product"
            element={
              <ProtectedRoutesForAdmin>
                <UpdateProduct />
              </ProtectedRoutesForAdmin>
            }
          />
          <Route
            path="/addcategory"
            element={
              <ProtectedRoutesForAdmin>
                <AddCategory />
              </ProtectedRoutesForAdmin>
            }
          />
          <Route
            path="/updatecategory/:id_category"
            element={
              <ProtectedRoutesForAdmin>
                <UpdateCategory />
              </ProtectedRoutesForAdmin>
            }
          />
          <Route path="/*" element={<NoPage />} />
        </Routes>
      </Router>
    </MyState>
    </PayPalScriptProvider>
  );
}
export const ProtectedRoutes = ({ children }) => {
  if (localStorage.getItem("user")) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};

export const ProtectedRoutesForAdmin = ({ children }) => {
  const admin = JSON.parse(localStorage.getItem("user"));

  if (admin.email === "admin@gmail.com") {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};
