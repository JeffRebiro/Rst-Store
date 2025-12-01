import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_PAYMENT_METHOD,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_CLEAR_ITEMS,
  CART_RESET,
} from "../constants/cartConstants";

// Helper function to load cart from localStorage based on user
const loadInitialState = () => {
  try {
    // Get user info if available
    const userInfo = localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null;
    
    // Use user-specific cart key
    const cartKey = userInfo ? `cartItems_${userInfo._id}` : "cartItems_guest";
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
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
    return {
      cartItems: [],
      shippingAddress: {},
      paymentMethod: "",
    };
  }
};

export const cartReducer = (state = loadInitialState(), action) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      const item = action.payload;
      const existsItem = state.cartItems.find(
        (i) => i.product === item.product
      );
      if (existsItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((i) =>
            i.product === existsItem.product ? item : i
          ),
        };
      } else {
        return { ...state, cartItems: [...state.cartItems, item] };
      }
      
    case CART_REMOVE_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter((i) => i.product !== action.payload),
      };
      
    case CART_SAVE_SHIPPING_ADDRESS:
      return { ...state, shippingAddress: action.payload };
      
    case CART_SAVE_PAYMENT_METHOD:
      return { ...state, paymentMethod: action.payload };
      
    case CART_CLEAR_ITEMS:
      return {
        ...state,
        cartItems: [],
        shippingAddress: {},
        paymentMethod: "",
      };
      
    case CART_RESET:
      return loadInitialState(); // Reload cart based on current user
      
    default:
      return state;
  }
};