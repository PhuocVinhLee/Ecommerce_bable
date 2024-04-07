import React, { useContext } from "react";
import Layout from "../../components/layout/Layout";
import myContext from "../../context/data/myContext";
import HeroSection from "../../components/heroSection/HreoSection";
import Filter from "../../components/filter/Filter";
import ProductCard from "../../components/productCard/ProductCard";
import Track from "../../components/track/Track";
import Testimonial from "../../components/testimonial/Testimonial";
import { useDispatch, useSelector } from "react-redux";
import { addToCart,deleteFromCart } from "../../redux/cartSlice";
import SellingProducts from "../../components/sellingProducts/SellingProducts";
import TopProducts from "../../components/topProducts/TopProducts";
import Banner from "../../components/banner/Banner";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItem = useSelector((state)=> state.cart)
console.log(cartItem)
  const addCart=()=>{
    dispatch(addToCart("addCart ne"))
  }
  const deleteCart=()=>{
    dispatch(deleteFromCart("delete ne"))
  }

  const context = useContext(myContext);
  console.log(context);
  return (
  <div >
      <Layout>
    {/* <div className="flex">
      <button onClick={()=>{
        addCart()
      }}>AddCArt</button>
      <button  onClick={()=>{deleteCart()}}>Delete CArt</button>
    </div> */}
      <div  onClick={()=>{
    navigate("/allproducts")
  }}><HeroSection ></HeroSection>
      <SellingProducts></SellingProducts>
      <TopProducts></TopProducts>
      <Banner></Banner>
      {/* <Filter></Filter> */}
      {/* <ProductCard></ProductCard> */}
      {/* <Track></Track> */}
    <Testimonial></Testimonial></div>
    </Layout>
  </div>
  );
}

export default Home;
