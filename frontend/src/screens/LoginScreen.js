import {
  Flex,
  Button,
  Heading,
  Input,
  Link,
  Spacer,
  Text,
  Field,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Link as RouterLink,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { login } from "../actions/userActions";
import FormContainer from "../components/FormContainer";
import Message from "../components/Message";

const LoginScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  let redirect = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo, loading, error } = userLogin;

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  return (
    <Flex w="full" alignItems="center" justifyContent="center" py="5" mt="5">
      <FormContainer>
        <Heading as="h1" mb="8" fontSize="3xl">
          Login
        </Heading>

        {error && <Message type="error">Invalid username or password</Message>}

        <form onSubmit={submitHandler}>
          {/* Email */}
          <Field.Root>
            <Field.Label>Email address</Field.Label>
            <Input
              type="email"
              placeholder="Enter your email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {/* Optional error text if you want to add validation later */}
            {/* <Field.ErrorText>Email is required</Field.ErrorText> */}
          </Field.Root>

          <Spacer h="3" />

          {/* Password */}
          <Field.Root>
            <Field.Label>Password</Field.Label>
            <Input
              type="password"
              placeholder="************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* Optional */}
            {/* <Field.ErrorText>Password is required</Field.ErrorText> */}
          </Field.Root>

          <Button type="submit" colorScheme="teal" mt="4" isLoading={loading}>
            Login
          </Button>
        </form>

        <Flex pt="10">
          <Text fontWeight="semibold">
            New Customer?{" "}
            <Link as={RouterLink} to="/register">
              Click here to register
            </Link>
          </Text>
        </Flex>
      </FormContainer>
    </Flex>
  );
};

export default LoginScreen;
