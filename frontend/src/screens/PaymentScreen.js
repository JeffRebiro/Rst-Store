import {
  Button,
  Flex,
  Heading,
  VStack,
  Box,
  RadioGroup,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";

import { savePaymentMethod } from "../actions/cartActions";
import CheckoutSteps from "../components/CheckoutSteps";
import FormContainer from "../components/FormContainer";

const PaymentScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();
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
            <VStack gap="6" align="stretch">
              <RadioGroup.Root
                value={paymentMethodRadio}
                onValueChange={setPaymentMethodRadio}
              >
                <VStack align="start" gap="4">
                  <RadioGroup.Item value="paypal">
                    <RadioGroup.ItemHiddenInput />
                    <RadioGroup.ItemControl>
                      <RadioGroup.ItemIndicator />
                    </RadioGroup.ItemControl>
                    <RadioGroup.ItemText>
                      PayPal or Credit/Debit Card
                    </RadioGroup.ItemText>
                  </RadioGroup.Item>
                </VStack>
              </RadioGroup.Root>

              <Button
                type="submit"
                colorPalette="teal"
                size="lg"
                width="full"
                mt="4"
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