// cartReducer.js
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_PAYMENT_METHOD,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_CLEAR_ITEMS,
  CART_RESET,
} from "../constants/cartConstants";

// Track if we've already loaded the initial state
let isInitialized = false;
let currentUserCartKey = null;

// Helper function to get cart key for current user
const getCurrentCartKey = () => {
  const userInfo = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;
  
  return userInfo ? `cart_${userInfo._id}` : 'cart_guest';
};

// Load cart from localStorage
const loadCartFromStorage = () => {
  const cartKey = getCurrentCartKey();
  currentUserCartKey = cartKey;
  
  const cartItems = localStorage.getItem(cartKey)
    ? JSON.parse(localStorage.getItem(cartKey))
    : [];

  const shippingAddress = localStorage.getItem("shippingAddress")
    ? JSON.parse(localStorage.getItem("shippingAddress"))
    : {};

  const paymentMethod = localStorage.getItem("paymentMethod")
    ? JSON.parse(localStorage.getItem("paymentMethod"))
    : "";

  return {
    cartItems,
    shippingAddress,
    paymentMethod,
  };
};

// Initial state
const initialState = loadCartFromStorage();
isInitialized = true;

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      const item = action.payload;
      const existsItem = state.cartItems.find((i) => i.product === item.product);
      
      let newCartItems;
      if (existsItem) {
        newCartItems = state.cartItems.map((i) =>
          i.product === existsItem.product ? item : i
        );
      } else {
        newCartItems = [...state.cartItems, item];
      }
      
      // Save to current user's cart
      const currentKey = getCurrentCartKey();
      localStorage.setItem(currentKey, JSON.stringify(newCartItems));
      currentUserCartKey = currentKey;
      
      return {
        ...state,
        cartItems: newCartItems,
      };
      
    case CART_REMOVE_ITEM:
      const filteredItems = state.cartItems.filter((i) => i.product !== action.payload);
      
      // Save to current user's cart
      const currentKey2 = getCurrentCartKey();
      localStorage.setItem(currentKey2, JSON.stringify(filteredItems));
      currentUserCartKey = currentKey2;
      
      return {
        ...state,
        cartItems: filteredItems,
      };
      
    case CART_SAVE_SHIPPING_ADDRESS:
      localStorage.setItem("shippingAddress", JSON.stringify(action.payload));
      return { ...state, shippingAddress: action.payload };
      
    case CART_SAVE_PAYMENT_METHOD:
      localStorage.setItem("paymentMethod", JSON.stringify(action.payload));
      return { ...state, paymentMethod: action.payload };
      
    case CART_CLEAR_ITEMS:
      const currentKey3 = getCurrentCartKey();
      localStorage.removeItem(currentKey3);
      
      return {
        ...state,
        cartItems: [],
        shippingAddress: {},
        paymentMethod: "",
      };
      
    case CART_RESET:
      // Only reload if user actually changed
      const newCartKey = getCurrentCartKey();
      if (newCartKey !== currentUserCartKey) {
        currentUserCartKey = newCartKey;
        return loadCartFromStorage();
      }
      return state; // Same user, don't reload
      
    default:
      return state;
  }
};