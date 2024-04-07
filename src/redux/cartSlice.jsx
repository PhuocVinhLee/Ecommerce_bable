import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem("cart")) ?? [];
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const findProduct = state.find((product) => {
        // undefine neu k tim thay
console.log(action.payload)
        return product.id == 
          action.payload.product.id;
      });

      let newProduct = {};
      if (findProduct) {
        newProduct = {
          ...action.payload.product,
          productNumber:
            findProduct.productNumber + action.payload.productNumber,
        };

        let newState = state.filter((product) => {
          return product.id != action.payload.product.id;
        });

        //  newState[findindex] = newProduct;

        newState.push(newProduct);
       
        return newState;
      }
      newProduct = {
        ...action.payload.product,
        productNumber: action.payload.productNumber,
      };

      return [...state, newProduct]
    },
    deleteFromCart(state, action) {
      return state.filter((item) => item.id != action.payload.id);
    },
    refreshCart(state, action) {
    let newProduct = []
    localStorage.removeItem("cart")
       return newProduct;
    
    },
  },
});

export const { addToCart, deleteFromCart ,refreshCart} = cartSlice.actions;

export default cartSlice.reducer;
