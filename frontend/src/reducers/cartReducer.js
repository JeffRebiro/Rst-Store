// cartReducer.js
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

// Helper function to load cart from localStorage based on current user
const loadCartFromStorage = () => {
  try {
    // Get user info if available
    const userInfo = localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null;
    
    const userId = userInfo?._id;
    const cartKey = getCartKey(userId);
    
    // Load cart items
    const cartItems = localStorage.getItem(cartKey)
      ? JSON.parse(localStorage.getItem(cartKey))
      : [];

    // Load shipping and payment (these are shared for now)
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
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
    return {
      cartItems: [],
      shippingAddress: {},
      paymentMethod: "",
    };
  }
};

export const cartReducer = (state = loadCartFromStorage(), action) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      const item = action.payload;
      const existsItem = state.cartItems.find(
        (i) => i.product === item.product
      );
      let newCartItems;
      
      if (existsItem) {
        newCartItems = state.cartItems.map((i) =>
          i.product === existsItem.product ? item : i
        );
      } else {
        newCartItems = [...state.cartItems, item];
      }
      
      // Save to localStorage whenever cart changes
      const userInfo = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null;
      const userId = userInfo?._id;
      const cartKey = getCartKey(userId);
      localStorage.setItem(cartKey, JSON.stringify(newCartItems));
      
      return {
        ...state,
        cartItems: newCartItems,
      };
      
    case CART_REMOVE_ITEM:
      const filteredItems = state.cartItems.filter((i) => i.product !== action.payload);
      
      // Save to localStorage
      const userInfo2 = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null;
      const userId2 = userInfo2?._id;
      const cartKey2 = getCartKey(userId2);
      localStorage.setItem(cartKey2, JSON.stringify(filteredItems));
      
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
      // Clear current user's cart
      const userInfo3 = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null;
      const userId3 = userInfo3?._id;
      const cartKey3 = getCartKey(userId3);
      localStorage.removeItem(cartKey3);
      
      return {
        ...state,
        cartItems: [],
        shippingAddress: {},
        paymentMethod: "",
      };
      
    case CART_RESET:
      // Load fresh cart for current user
      return loadCartFromStorage();
      
    default:
      return state;
  }
};