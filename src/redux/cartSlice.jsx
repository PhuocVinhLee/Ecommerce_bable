import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem("cart")) ?? [];
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      console.log(action.payload);
      const findProduct = state.find((product) => {
        // undefine neu k tim thay
        return (
          product.id == action.payload?.id &&
          product.color == action.payload.color &&
          product.size == action.payload.size
        );
      });

      let newProduct = {};

      if (
        findProduct &&
        findProduct.color == action.payload.color &&
        findProduct.size == action.payload.size
      ) {
        newProduct = {
          ...action.payload,
          quantity: findProduct.quantity + action.payload.quantity,
        };

        let newState = state.filter((product) => {
          return (
            product.id != action.payload.id ||
            product.color != action.payload.color ||
            product.size != action.payload.size
          ); // delte product old
        });

        //  newState[findindex] = newProduct;

        newState.push(newProduct);

        return newState;
        //  return state
      }

      newProduct = {
        ...action.payload,
      };

      return [...state, newProduct];
    },
    deleteFromCart(state, action) {
      return state.filter(
        (item) =>
          item.id != action.payload.id ||
          item.color != action.payload.color ||
          item.size != action.payload.size
      );
    },
    updateFromCart(state, action) {
      const findProduct = state.find((product) => {
        // undefine neu k tim thay
        return (
          product.id == action.payload?.id &&
          product.color == action.payload.color &&
          product.size == action.payload.size
        );
      });
      const newState = [];
      if (findProduct) {

        
        return state.filter(
          (item) =>
            item.id != action.payload.id ||
            item.color != action.payload.color ||
            item.size != action.payload.size
        );
      } else {
        return state;
      }
    },

    refreshCart(state, action) {
      let newProduct = [];
      localStorage.removeItem("cart");
      return newProduct;
    },
  },
});

export const { addToCart, deleteFromCart, refreshCart } = cartSlice.actions;

export default cartSlice.reducer;
