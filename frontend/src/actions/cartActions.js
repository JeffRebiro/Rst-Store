import axios from "axios";
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_PAYMENT_METHOD,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_CLEAR_ITEMS,
  CART_RESET,
} from "../constants/cartConstants";

// Helper function to get user-specific cart key
const getCartKey = (userId) => {
  return userId ? `cartItems_${userId}` : "cartItems_guest";
};

export const addToCart = (id, qty) => async (dispatch, getState) => {
  const { data } = await axios.get(`https://rst-store-enz3.onrender.com/api/products/${id}`);

  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      product: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      countInStock: data.countInStock,
      qty,
    },
  });

  // Get user from state and save with user-specific key
  const {
    userLogin: { userInfo },
  } = getState();
  
  const cartKey = getCartKey(userInfo?._id);
  localStorage.setItem(cartKey, JSON.stringify(getState().cart.cartItems));
};

export const removeFromCart = (id) => (dispatch, getState) => {
  dispatch({ type: CART_REMOVE_ITEM, payload: id });

  // Get user from state and save with user-specific key
  const {
    userLogin: { userInfo },
  } = getState();
  
  const cartKey = getCartKey(userInfo?._id);
  localStorage.setItem(cartKey, JSON.stringify(getState().cart.cartItems));
};

export const saveShippingAddress = (data) => (dispatch) => {
  dispatch({ type: CART_SAVE_SHIPPING_ADDRESS, payload: data });
  localStorage.setItem("shippingAddress", JSON.stringify(data));
};

export const savePaymentMethod = (data) => (dispatch) => {
  dispatch({ type: CART_SAVE_PAYMENT_METHOD, payload: data });
  localStorage.setItem("paymentMethod", JSON.stringify(data));
};

export const clearCart = () => (dispatch) => {
  dispatch({ type: CART_CLEAR_ITEMS });
};

export const resetCart = () => (dispatch, getState) => {
  // Get current user info to clear their specific cart
  const {
    userLogin: { userInfo },
  } = getState();
  
  const cartKey = getCartKey(userInfo?._id);
  localStorage.removeItem(cartKey);
  
  dispatch({ type: CART_RESET });
};