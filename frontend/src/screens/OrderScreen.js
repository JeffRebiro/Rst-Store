import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Image,
  Link,
  Text,
  VStack,
  Separator, // <- updated
} from "@chakra-ui/react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useTheme as useNextTheme } from "next-themes";

import { deliverOrder, getOrderDetails, payOrder } from "../actions/orderActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { ORDER_DELIVER_RESET, ORDER_PAY_RESET } from "../constants/orderConstants";

const OrderScreen = () => {
  const dispatch = useDispatch();
  const { id: orderId } = useParams();

  const { theme } = useNextTheme(); 
  const isLight = theme === "light";
  const cardBg = isLight ? "white" : "gray.700";

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch({ type: ORDER_PAY_RESET });
    dispatch({ type: ORDER_DELIVER_RESET });

    if (!order || successPay || successDeliver || order._id !== orderId) {
      dispatch(getOrderDetails(orderId));
    }
  }, [dispatch, orderId, order, successPay, successDeliver]);

  if (!loading && order) {
    order.itemsPrice = order.orderItems.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    );
  }

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult));
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message type="error">{error}</Message>
  ) : (
    <Flex w="full" py="8" direction="column">
      <Grid templateColumns={{ base: "1fr", md: "3fr 2fr" }} gap="8">
        {/* Left Side */}
        <VStack spacing="6" align="stretch">
          {/* Shipping */}
          <Box bg={cardBg} p="6" shadow="md" rounded="lg" borderWidth="1px">
            <Heading fontSize="2xl" mb="4">Shipping</Heading>
            <Text><strong>Name:</strong> {order.user.name}</Text>
            <Text>
              <strong>Email:</strong>{" "}
              <Link color="teal.500" href={`mailto:${order.user.email}`}>{order.user.email}</Link>
            </Text>
            <Text mt="2">
              <strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </Text>
            <Box mt="4">
              {order.isDelivered ? (
                <Message type="success">Delivered on {order.deliveredAt}</Message>
              ) : (
                <Message type="warning">Not Delivered</Message>
              )}
            </Box>
          </Box>

          {/* Payment */}
          <Box bg={cardBg} p="6" shadow="md" rounded="lg" borderWidth="1px">
            <Heading fontSize="2xl" mb="4">Payment Method</Heading>
            <Text><strong>Method:</strong> {order.paymentMethod.toUpperCase()}</Text>
            <Box mt="4">
              {order.isPaid ? (
                <Message type="success">Paid on {new Date(order.paidAt).toUTCString()}</Message>
              ) : (
                <Message type="warning">Not Paid</Message>
              )}
            </Box>
          </Box>

          {/* Order Items */}
          <Box bg={cardBg} p="6" shadow="md" rounded="lg" borderWidth="1px">
            <Heading fontSize="2xl" mb="4">Order Items</Heading>
            {order.orderItems.length === 0 ? (
              <Message>No Order Info</Message>
            ) : (
              <VStack spacing="4" align="stretch">
                {order.orderItems.map((item, idx) => (
                  <Flex key={idx} align="center" justify="space-between">
                    <Flex align="center">
                      <Image src={item.image} alt={item.name} boxSize="50px" objectFit="cover" mr="4" rounded="md" />
                      <Link as={RouterLink} to={`/products/${item.product}`} fontWeight="bold" fontSize="lg" color="teal.600">{item.name}</Link>
                    </Flex>
                    <Text fontWeight="medium">{item.qty} x ${item.price} = ${item.qty * item.price}</Text>
                  </Flex>
                ))}
              </VStack>
            )}
          </Box>
        </VStack>

        {/* Right Side */}
        <Box bg={cardBg} p="8" shadow="lg" rounded="lg" borderWidth="1px">
          <Heading fontSize="2xl" mb="6" textAlign="center">Order Summary</Heading>
          <VStack spacing="4" divider={<Separator />} align="stretch">
            <Flex justify="space-between"><Text>Items</Text><Text fontWeight="bold">${order.itemsPrice}</Text></Flex>
            <Flex justify="space-between"><Text>Shipping</Text><Text fontWeight="bold">${order.shippingPrice}</Text></Flex>
            <Flex justify="space-between"><Text>Tax</Text><Text fontWeight="bold">${order.taxPrice}</Text></Flex>
            <Flex justify="space-between"><Text>Total</Text><Text fontWeight="bold" fontSize="xl">${order.totalPrice}</Text></Flex>
          </VStack>

          {!order.isPaid && (
            <Box mt="8">
              {loadingPay ? <Loader /> : (
                <PayPalScriptProvider options={{"client-id": "AbCWawRqgTtLVVCXOZojr41rc7ooz60ClZWU8y8UynDk3KmHn5syU0o41cyMi5iyh_E3brYWPGuLOFfr", components: "buttons"}}>
                  <PayPalButtons
                    createOrder={(data, actions) => actions.order.create({ purchase_units: [{ amount: { value: order.totalPrice } }] })}
                    onApprove={(data, actions) => actions.order.capture().then((details) => {
                      const paymentResult = {
                        id: details.id,
                        status: details.status,
                        update_time: details.update_time,
                        email_address: details.payer.email_address,
                      };
                      successPaymentHandler(paymentResult);
                    })}
                  />
                </PayPalScriptProvider>
              )}
            </Box>
          )}

          {loadingDeliver && <Loader />}
          {userInfo && userInfo.isAdmin && !order.isDelivered && (
            <Button mt="6" w="full" colorScheme="teal" onClick={deliverHandler} size="lg">Mark as Delivered</Button>
          )}
        </Box>
      </Grid>
    </Flex>
  );
};

export default OrderScreen;
