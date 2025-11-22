import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Image,
  Link,
  Text,
  Separator,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useTheme as useNextTheme } from "next-themes";

import { createOrder } from "../actions/orderActions";
import CheckoutSteps from "../components/CheckoutSteps";
import Message from "../components/Message";

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useNextTheme();
  const isLight = theme === "light";

  const cart = useSelector((state) => state.cart);

  // Calculate prices
  const itemsPrice = cart.cartItems.reduce(
    (acc, currVal) => acc + currVal.price * +currVal.qty,
    0
  );
  const shippingPrice = itemsPrice < 10000 ? 5000 : 0;
  const taxPrice = (18 * itemsPrice) / 100;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, error, loading } = orderCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const placeOrderHandler = () => {
    // Validate shipping address has country
    if (!cart.shippingAddress || !cart.shippingAddress.country) {
      alert('Please complete the shipping address first');
      navigate('/shipping');
      return;
    }

    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: itemsPrice,
        shippingPrice: shippingPrice,
        taxPrice: taxPrice,
        totalPrice: totalPrice,
      })
    );
  };

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
      return;
    }
    if (!cart.shippingAddress) {
      navigate("/shipping");
      return;
    }
    if (!cart.paymentMethod) {
      navigate("/payment");
      return;
    }
    if (success && order) {
      navigate(`/order/${order._id}`);
    }
  }, [navigate, success, order, userInfo, cart.shippingAddress, cart.paymentMethod]);

  const boxBg = isLight ? "white" : "gray.700";
  const borderColor = isLight ? "gray.200" : "gray.600";

  return (
    <Flex w="full" direction="column" py="10">
      <CheckoutSteps step1 step2 step3 step4 />
      <Grid templateColumns={{ base: "1fr", lg: "3fr 1fr" }} gap="12">
        {/* Column 1 - Order Details */}
        <Flex direction="column">
          {/* Shipping */}
          <Box borderBottom="1px solid" py="6" borderColor={borderColor}>
            <Heading as="h2" mb="4" fontSize="2xl" fontWeight="bold">
              Shipping
            </Heading>
            <Text>
              <strong>Address: </strong>
              {cart.shippingAddress?.address}, {cart.shippingAddress?.city},{" "}
              {cart.shippingAddress?.postalCode}, {cart.shippingAddress?.country}
            </Text>
          </Box>

          {/* Payment */}
          <Box borderBottom="1px solid" py="6" borderColor={borderColor}>
            <Heading as="h2" mb="4" fontSize="2xl" fontWeight="bold">
              Payment Method
            </Heading>
            <Text>
              <strong>Method: </strong> {cart.paymentMethod?.toUpperCase()}
            </Text>
          </Box>

          {/* Order Items */}
          <Box borderBottom="1px solid" py="6" borderColor={borderColor}>
            <Heading as="h2" mb="4" fontSize="2xl" fontWeight="bold">
              Order Items
            </Heading>
            {cart.cartItems.length === 0 ? (
              <Message>Your cart is empty</Message>
            ) : (
              <Box>
                {cart.cartItems.map((item, idx) => (
                  <Flex
                    key={idx}
                    justifyContent="space-between"
                    alignItems="center"
                    py="4"
                  >
                    <Flex alignItems="center">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width="12"
                        height="12"
                        objectFit="cover"
                        marginRight="4"
                        borderRadius="md"
                      />
                      <Link
                        as={RouterLink}
                        to={`/products/${item.product}`}
                        fontWeight="bold"
                        fontSize="lg"
                        _hover={{ color: "teal.500" }}
                      >
                        {item.name}
                      </Link>
                    </Flex>
                    <Text fontWeight="semibold" fontSize="lg">
                      {item.qty} x ${item.price} = ${+item.qty * item.price}
                    </Text>
                  </Flex>
                ))}
              </Box>
            )}
          </Box>
        </Flex>

        {/* Column 2 - Order Summary */}
        <Flex
          direction="column"
          backgroundColor={boxBg}
          boxShadow="lg"
          borderRadius="lg"
          py="8"
          px="6"
          justifyContent="space-between"
          border="1px solid"
          borderColor={borderColor}
        >
          <Box>
            <Heading as="h2" fontSize="2xl" fontWeight="bold" mb="6">
              Order Summary
            </Heading>

            <Flex justifyContent="space-between" py="2">
              <Text fontSize="lg">Items</Text>
              <Text fontWeight="bold" fontSize="lg">
                ${itemsPrice.toFixed(2)}
              </Text>
            </Flex>
            <Separator borderColor={borderColor} />
            <Flex justifyContent="space-between" py="2">
              <Text fontSize="lg">Shipping</Text>
              <Text fontWeight="bold" fontSize="lg">
                ${shippingPrice.toFixed(2)}
              </Text>
            </Flex>
            <Separator borderColor={borderColor} />
            <Flex justifyContent="space-between" py="2">
              <Text fontSize="lg">Tax</Text>
              <Text fontWeight="bold" fontSize="lg">
                ${taxPrice.toFixed(2)}
              </Text>
            </Flex>
            <Separator borderColor={borderColor} />
            <Flex justifyContent="space-between" py="2">
              <Text fontSize="lg">Total</Text>
              <Text fontWeight="bold" fontSize="lg">
                ${totalPrice.toFixed(2)}
              </Text>
            </Flex>
          </Box>

          {error && (
            <Message type="error" mb="4">
              {error}
            </Message>
          )}

          <Button
            size="lg"
            colorPalette="teal" // Updated from colorScheme
            width="full"
            mt="6"
            textTransform="uppercase"
            onClick={placeOrderHandler}
            disabled={cart.cartItems.length === 0 || loading} // Updated from isDisabled
            _hover={{ bg: "teal.600" }}
            loading={loading} // Show loading state
          >
            {loading ? "Placing Order..." : "Place Order"}
          </Button>
        </Flex>
      </Grid>
    </Flex>
  );
};

export default PlaceOrderScreen;