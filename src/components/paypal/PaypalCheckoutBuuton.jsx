import React,{useState} from 'react'
import {  PayPalButtons } from "@paypal/react-paypal-js";

const  PaypalCheckoutBuuton = (props)=>{
    const {product} = props;
    const {handleApprove} = props;
   
    

  
    const [error, setError] = useState(null);
    if (error) {
        // Display error message, modal or redirect user to error page
        alert(error);
      }

    return <PayPalButtons  
    style={{
      disableMaxWidth: true
    
    }}

    onClick={(data, actions) => {
        // Validate on button click, client or server side
        const hasAlreadyBoughtCourse = false;
      
        if (hasAlreadyBoughtCourse) {
          setError(
            "You already bought this course. Go to your account to view your list of courses."
          );
      
          return actions.reject();
        } else {
          return actions.resolve();
        }
      }}

    createOrder={(data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              description: product.description,
              amount: {
                value: product.price
              }
            }
          ]
        });
      }}

      onCancel={() => {
        // Display cancel message, modal or redirect user to cancel page or back to cart
      }}

      onApprove={async (data, actions) => {
        const order = await actions.order.capture(); 
        console.log("order", order);

      
        handleApprove(order);
      }}

      onError={(err) => {
        setError(err);
        console.error("PayPal Checkout onError", err);
      }}

    ></PayPalButtons>
 
}

export  default PaypalCheckoutBuuton;

