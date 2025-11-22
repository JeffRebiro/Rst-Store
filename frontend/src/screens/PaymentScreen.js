import {
  Button,
  Flex,
  Heading,
  VStack,
  Box,
  RadioGroup,
  Text,
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
                  {/* PayPal Option */}
                  <RadioGroup.Item value="paypal">
                    <RadioGroup.ItemHiddenInput />
                    <RadioGroup.ItemIndicator />
                    <RadioGroup.ItemText>
                      <Text fontWeight="medium">PayPal or Credit/Debit Card</Text>
                      <Text fontSize="sm" color="gray.600">
                        Pay securely with PayPal, Visa, Mastercard, or American Express
                      </Text>
                    </RadioGroup.ItemText>
                  </RadioGroup.Item>

                  {/* Stripe Option */}
                  <RadioGroup.Item value="stripe">
                    <RadioGroup.ItemHiddenInput />
                    <RadioGroup.ItemIndicator />
                    <RadioGroup.ItemText>
                      <Text fontWeight="medium">Stripe</Text>
                      <Text fontSize="sm" color="gray.600">
                        Pay with credit/debit card using Stripe
                      </Text>
                    </RadioGroup.ItemText>
                  </RadioGroup.Item>

                  {/* Bank Transfer Option */}
                  <RadioGroup.Item value="bank_transfer">
                    <RadioGroup.ItemHiddenInput />
                    <RadioGroup.ItemIndicator />
                    <RadioGroup.ItemText>
                      <Text fontWeight="medium">Bank Transfer</Text>
                      <Text fontSize="sm" color="gray.600">
                        Transfer money directly to our bank account
                      </Text>
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