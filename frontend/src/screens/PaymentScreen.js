import {
  Button,
  Flex,
  Heading,
  VStack,
  Box,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTheme as useNextTheme } from "next-themes";

import { savePaymentMethod } from "../actions/cartActions";
import CheckoutSteps from "../components/CheckoutSteps";
import FormContainer from "../components/FormContainer";

const PaymentScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useNextTheme();
  const isLight = theme === "light";

  const cart = useSelector((state) => state.cart);
  const { shippingAddress, paymentMethod } = cart;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [paymentMethodRadio, setPaymentMethodRadio] = useState(
    paymentMethod || "paypal"
  );

  useEffect(() => {
    if (!userInfo) navigate("/login");
    if (!shippingAddress) navigate("/shipping");
  }, [navigate, shippingAddress, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethodRadio));
    navigate("/placeorder");
  };

  return (
    <Flex w="full" alignItems="center" justifyContent="center" py="10">
      <FormContainer>
        <Box
          bg={isLight ? "white" : "gray.700"}
          boxShadow="lg"
          p="8"
          rounded="lg"
        >
          <CheckoutSteps step1 step2 step3 />

          <Heading as="h2" mb="6" fontSize="2xl" textAlign="center">
            Select Payment Method
          </Heading>

          <form onSubmit={submitHandler}>
            <VStack spacing="6" align="stretch">
              <RadioGroup
                value={paymentMethodRadio}
                onChange={setPaymentMethodRadio}
              >
                <VStack align="start" spacing="4">
                  <Radio value="paypal">PayPal or Credit/Debit Card</Radio>
                </VStack>
              </RadioGroup>

              <Button
                type="submit"
                colorScheme="teal"
                size="lg"
                width="full"
                mt="4"
                _hover={{ bg: "teal.600" }}
              >
                Continue
              </Button>
            </VStack>
          </form>
        </Box>
      </FormContainer>
    </Flex>
  );
};

export default PaymentScreen;
