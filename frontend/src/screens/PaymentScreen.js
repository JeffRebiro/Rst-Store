import {
  Button,
  Flex,
  Heading,
  VStack,
  Box,
  useColorModeValue,
  RadioGroup,
  Radio,
  Fieldset,
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
    <Flex w="full" alignItems="center" justifyContent="center" py="10">
      <FormContainer>
        <Box
          bg={useColorModeValue("white", "gray.700")}
          boxShadow="lg"
          p="8"
          rounded="lg"
        >
          {/* Checkout Steps */}
          <CheckoutSteps step1 step2 step3 />

          {/* Heading */}
          <Heading as="h2" mb="6" fontSize="2xl" textAlign="center">
            Select Payment Method
          </Heading>

          {/* Form */}
          <form onSubmit={submitHandler}>
            <VStack spacing="6" align="stretch">
              {/* Payment Options - NEW V3 FIELDSET */}
              <Fieldset.Root>
                <Fieldset.Legend fontWeight="bold">
                  Payment Options
                </Fieldset.Legend>

                <RadioGroup
                  value={paymentMethodRadio}
                  onChange={setPaymentMethodRadio}
                >
                  <VStack align="start" spacing="4">
                    <Radio value="paypal" size="lg">
                      PayPal or Credit/Debit Card
                    </Radio>

                    {/* Add more options here if you want */}
                  </VStack>
                </RadioGroup>
              </Fieldset.Root>

              {/* Submit */}
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
