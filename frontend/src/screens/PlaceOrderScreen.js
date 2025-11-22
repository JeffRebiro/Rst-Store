import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Image,
  Link,
  Stack,
  Text,
  Separator,
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

  const cart = useSelector((state) => state.cart);

  cart.itemsPrice = cart.cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  cart.shippingPrice = cart.itemsPrice < 10000 ? 5000 : 0;
  cart.taxPrice = Number((0.18 * cart.itemsPrice).toFixed(2));
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success } = orderCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
    if (success) {
      navigate(`/order/${order._id}`);
    }
  }, [navigate, success, order, userInfo]);

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

  return (
    <Flex w="full" direction="column" py="10" px={{ base: "4", md: "8" }}>
      <CheckoutSteps step1 step2 step3 step4 />

      <Grid templateColumns={{ base: "1fr", lg: "2.5fr 1fr" }} gap="8" mt="8">
        <Stack gap="6">
          <Box
            p="6"
            bg="white"
            rounded="lg"
            shadow="md"
            border="1px solid"
            borderColor="gray.200"
            _dark={{ 
              bg: "gray.700",
              borderColor: "gray.600"
            }}
          >
            <Heading fontSize="2xl" mb="4">
              Shipping Information
            </Heading>
            <Text fontSize="md">
              <strong>Address:</strong> {cart.shippingAddress?.address},{" "}
              {cart.shippingAddress?.city}, {cart.shippingAddress?.postalCode},{" "}
              {cart.shippingAddress?.country}
            </Text>
          </Box>

          <Box
            p="6"
            bg="white"
            rounded="lg"
            shadow="md"
            border="1px solid"
            borderColor="gray.200"
            _dark={{ 
              bg: "gray.700",
              borderColor: "gray.600"
            }}
          >
            <Heading fontSize="2xl" mb="4">
              Payment Method
            </Heading>
            <Text fontSize="md">
              <strong>Method:</strong> {cart.paymentMethod?.toUpperCase()}
            </Text>
          </Box>

          <Box
            p="6"
            bg="white"
            rounded="lg"
            shadow="md"
            border="1px solid"
            borderColor="gray.200"
            _dark={{ 
              bg: "gray.700",
              borderColor: "gray.600"
            }}
          >
            <Heading fontSize="2xl" mb="4">
              Order Items
            </Heading>

            {cart.cartItems.length === 0 ? (
              <Message>Your cart is empty.</Message>
            ) : (
              <Stack gap="4">
                {cart.cartItems.map((item, idx) => (
                  <Flex
                    key={idx}
                    align="center"
                    justify="space-between"
                    w="full"
                  >
                    <Flex align="center">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width="60px"
                        height="60px"
                        objectFit="cover"
                        rounded="md"
                        mr="4"
                      />
                      <Link
                        asChild
                        fontWeight="bold"
                        fontSize="lg"
                        _hover={{ color: "teal.500" }}
                      >
                        <RouterLink to={`/products/${item.product}`}>
                          {item.name}
                        </RouterLink>
                      </Link>
                    </Flex>
                    <Text fontSize="md" fontWeight="semibold">
                      {item.qty} x ₹{item.price} = ₹{item.qty * item.price}
                    </Text>
                  </Flex>
                ))}
              </Stack>
            )}
          </Box>
        </Stack>

        <Flex
          direction="column"
          p="6"
          bg="white"
          shadow="lg"
          rounded="lg"
          border="1px solid"
          borderColor="gray.200"
          _dark={{ 
            bg: "gray.700",
            borderColor: "gray.600"
          }}
        >
          <Heading fontSize="2xl" mb="6">
            Order Summary
          </Heading>

          <Stack gap="4">
            <Flex justify="space-between">
              <Text fontSize="md">Items</Text>
              <Text fontWeight="bold">₹{cart.itemsPrice}</Text>
            </Flex>
            <Separator />

            <Flex justify="space-between">
              <Text fontSize="md">Shipping</Text>
              <Text fontWeight="bold">₹{cart.shippingPrice}</Text>
            </Flex>
            <Separator />

            <Flex justify="space-between">
              <Text fontSize="md">Tax</Text>
              <Text fontWeight="bold">₹{cart.taxPrice}</Text>
            </Flex>
            <Separator />

            <Flex justify="space-between">
              <Text fontSize="lg" fontWeight="bold">
                Total
              </Text>
              <Text fontWeight="extrabold" fontSize="lg">
                ₹{cart.totalPrice}
              </Text>
            </Flex>
          </Stack>

          <Button
            size="lg"
            colorPalette="teal"
            mt="8"
            w="full"
            onClick={placeOrderHandler}
            disabled={cart.cartItems.length === 0}
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