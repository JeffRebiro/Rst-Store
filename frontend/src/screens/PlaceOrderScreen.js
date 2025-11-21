import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Image,
  Link,
  Text,
  Divider,
  useTheme,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import { createOrder } from "../actions/orderActions";
import CheckoutSteps from "../components/CheckoutSteps";
import Message from "../components/Message";

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isLight = theme?.colorMode === "light";

  const cart = useSelector((state) => state.cart);

  // Calculate prices
  cart.itemsPrice = cart.cartItems.reduce(
    (acc, currVal) => acc + currVal.price * +currVal.qty,
    0
  );
  cart.shippingPrice = cart.itemsPrice < 10000 ? 5000 : 0;
  cart.taxPrice = (18 * cart.itemsPrice) / 100;
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success } = orderCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      })
    );
  };

  useEffect(() => {
    if (!userInfo) navigate("/login");
    if (success) navigate(`/order/${order._id}`);
  }, [navigate, success, order, userInfo]);

  const boxBg = isLight ? "white" : "gray.700";
  const borderColor = isLight ? "gray.200" : "gray.600";

  return (
    <Flex w="full" direction="column" py="10">
      <CheckoutSteps step1 step2 step3 step4 />
      <Grid templateColumns={{ base: "1fr", lg: "3fr 1fr" }} gap="12">
        {/* Column 1 - Order Details */}
        <Flex direction="column">
          {/* Shipping */}
          <Box borderBottom="1px solid" py="6" borderColor="gray.300">
            <Heading as="h2" mb="4" fontSize="2xl" fontWeight="bold">
              Shipping
            </Heading>
            <Text>
              <strong>Address: </strong>
              {cart.shippingAddress.address}, {cart.shippingAddress.city},{" "}
              {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
            </Text>
          </Box>

          {/* Payment */}
          <Box borderBottom="1px solid" py="6" borderColor="gray.300">
            <Heading as="h2" mb="4" fontSize="2xl" fontWeight="bold">
              Payment Method
            </Heading>
            <Text>
              <strong>Method: </strong> {cart.paymentMethod.toUpperCase()}
            </Text>
          </Box>

          {/* Order Items */}
          <Box borderBottom="1px solid" py="6" borderColor="gray.300">
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
                        w="12"
                        h="12"
                        objectFit="cover"
                        mr="4"
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
          bgColor={boxBg}
          shadow="lg"
          rounded="lg"
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
                ${cart.itemsPrice}
              </Text>
            </Flex>
            <Divider />
            <Flex justifyContent="space-between" py="2">
              <Text fontSize="lg">Shipping</Text>
              <Text fontWeight="bold" fontSize="lg">
                ${cart.shippingPrice}
              </Text>
            </Flex>
            <Divider />
            <Flex justifyContent="space-between" py="2">
              <Text fontSize="lg">Tax</Text>
              <Text fontWeight="bold" fontSize="lg">
                ${cart.taxPrice}
              </Text>
            </Flex>
            <Divider />
            <Flex justifyContent="space-between" py="2">
              <Text fontSize="lg">Total</Text>
              <Text fontWeight="bold" fontSize="lg">
                ${cart.totalPrice}
              </Text>
            </Flex>
          </Box>

          <Button
            size="lg"
            colorScheme="teal"
            w="full"
            mt="6"
            textTransform="uppercase"
            onClick={placeOrderHandler}
            isDisabled={cart.cartItems.length === 0}
            _hover={{ bg: "teal.600" }}
          >
            Place Order
          </Button>
        </Flex>
      </Grid>
    </Flex>
  );
};

export default PlaceOrderScreen;
