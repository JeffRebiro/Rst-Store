import {
  Button,
  Flex,
  Field,
  Heading,
  RadioGroup,
  VStack,
  Box,
  Text,
  Radio,
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
    paymentMethod || "paypal"
  );

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }

    if (!shippingAddress) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethodRadio));
    navigate("/placeorder");
  };

  return (
    <Flex direction="column" w="full" alignItems="center" justifyContent="center" py="10" bg="gray.50">
      <FormContainer>
        <Box
          bg="white"
          boxShadow="lg"
          p="8"
          rounded="lg"
          w="full"
          maxW="lg"
          _dark={{ bg: "gray.700" }}
        >
          {/* Checkout Steps */}
          <CheckoutSteps step1 step2 step3 />

          {/* Heading */}
          <Heading as="h2" mb="6" fontSize="2xl" fontWeight="bold" textAlign="center">
            Make your Payment
          </Heading>

          {/* Payment Form */}
          <form onSubmit={submitHandler}>
            <VStack gap="6" align="stretch">
              {/* Payment Method Options */}
              <Field.Root required>
                <Field.Label fontWeight="semibold" fontSize="lg">
                  Choose your payment method
                </Field.Label>
                <RadioGroup value={paymentMethodRadio} onValueChange={setPaymentMethodRadio}>
                  <VStack align="start" gap="4">
                    <Radio value="paypal" size="lg">
                      PayPal or Credit/Debit Card
                    </Radio>
                    {/* Additional payment options can be added here */}
                    {/* <Radio value="stripe" size="lg">
                      Stripe
                    </Radio> */}
                  </VStack>
                </RadioGroup>
              </Field.Root>

              {/* Submit Button */}
              <Button
                type="submit"
                colorPalette="teal"
                size="lg"
                width="full"
                mt="4"
                _hover={{ bg: "teal.600" }}
                disabled={!paymentMethodRadio}
              >
                Continue
              </Button>
            </VStack>
          </form>

          {/* Disclaimer / Additional Information */}
          <Box mt="6" textAlign="center" color="gray.500">
            <Text fontSize="sm">
              By proceeding, you agree to our{" "}
              <strong>Terms & Conditions</strong>.
            </Text>
          </Box>
        </Box>
      </FormContainer>
    </Flex>
  );
};

export default PaymentScreen;