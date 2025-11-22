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

import { savePaymentMethod } from "../actions/cartActions";
import CheckoutSteps from "../components/CheckoutSteps";
import FormContainer from "../components/FormContainer";

const PaymentScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress, paymentMethod } = cart;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [paymentMethodRadio, setPaymentMethodRadio] = useState(
    paymentMethod || "PayPal"
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
          bg="white"
          boxShadow="lg"
          p="8"
          borderRadius="lg"
        >
          <CheckoutSteps step1 step2 step3 />

          <Heading as="h2" mb="6" fontSize="2xl" textAlign="center">
            Select Payment Method
          </Heading>

          <form onSubmit={submitHandler}>
            <VStack spacing="6" align="stretch">
              <RadioGroup.Root
                value={paymentMethodRadio}
                onValueChange={setPaymentMethodRadio}
              >
                <VStack align="start" spacing="4">
                  <RadioGroup.Item value="PayPal">
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