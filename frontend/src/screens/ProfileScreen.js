import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Icon,
  Input,
  Spacer,
  FieldRoot,
  FieldLabel,
  FieldErrorText,
} from "@chakra-ui/react";

import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/table";

import { useEffect, useState } from "react";
import { IoWarning } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { listMyOrders } from "../actions/orderActions";
import { getUserDetails, updateUserProfile } from "../actions/userActions";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { USER_DETAILS_RESET } from "../constants/userConstants";

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  const orderMyList = useSelector((state) => state.orderMyList);
  const { loading: loadingOrders, error: errorOrders, orders } = orderMyList;

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      if (!user.name) {
        dispatch(getUserDetails());
        dispatch(listMyOrders());
      } else {
        setName(user.name);
        setEmail(user.email);
      }
    }
  }, [dispatch, navigate, user, userInfo, success]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      dispatch(updateUserProfile({ id: user._id, name, email, password }));
    }

    dispatch({ type: USER_DETAILS_RESET });
  };

  return (
    <Grid templateColumns={{ sm: "1fr", md: "1fr 1fr" }} py="5" gap="10">
      <Flex w="full" alignItems="center" justifyContent="center" py="5">
        <FormContainer>
          <Heading as="h1" mb="8" fontSize="3xl">
            User Profile
          </Heading>

          {error && <Message type="error">{error}</Message>}
          {message && <Message type="error">{message}</Message>}

          <form onSubmit={submitHandler}>
            <FieldRoot>
              <FieldLabel>Your Name</FieldLabel>
              <Input
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FieldRoot>

            <Spacer h="3" />

            <FieldRoot>
              <FieldLabel>Email address</FieldLabel>
              <Input
                type="email"
                placeholder="username@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FieldRoot>

            <Spacer h="3" />

            <FieldRoot>
              <FieldLabel>Password</FieldLabel>
              <Input
                type="password"
                placeholder="************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FieldRoot>

            <Spacer h="3" />

            <FieldRoot>
              <FieldLabel>Confirm Password</FieldLabel>
              <Input
                type="password"
                placeholder="************"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </FieldRoot>

            <Button type="submit" colorScheme="teal" mt="4" isLoading={loading}>
              Update
            </Button>
          </form>
        </FormContainer>
      </Flex>

      {/* Second column - Orders */}
      <Flex direction="column">
        <Heading as="h2" mb="4">
          My Orders
        </Heading>

        {loadingOrders ? (
          <Loader />
        ) : errorOrders ? (
          <Message type="error">{errorOrders}</Message>
        ) : (
          <Table variant="striped">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>DATE</Th>
                <Th>TOTAL</Th>
                <Th>PAID</Th>
                <Th>DELIVERED</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {orders.map((order) => (
                <Tr key={order._id}>
                  <Td>{order._id}</Td>
                  <Td>{new Date(order.createdAt).toDateString()}</Td>
                  <Td>${order.totalPrice}</Td>
                  <Td>
                    {order.isPaid ? (
                      new Date(order.paidAt).toDateString()
                    ) : (
                      <Icon as={IoWarning} color="red" />
                    )}
                  </Td>
                  <Td>
                    {order.isDelivered ? (
                      new Date(order.deliveredAt).toDateString()
                    ) : (
                      <Icon as={IoWarning} color="red" />
                    )}
                  </Td>
                  <Td>
                    <Button
                      as={RouterLink}
                      to={`/order/${order._id}`}
                      colorScheme="teal"
                      size="sm"
                    >
                      Details
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Flex>
    </Grid>
  );
};

export default ProfileScreen;
