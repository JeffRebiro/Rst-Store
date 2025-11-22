import {
  Button,
  Flex,
  Heading,
  VStack,
  Box,
  RadioGroup,
  Text,
  HStack,
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

          {/* Show selected method prominently */}
          <Box 
            bg="teal.50" 
            border="2px solid" 
            borderColor="teal.200"
            p="4" 
            borderRadius="md" 
            mb="6"
            textAlign="center"
          >
            <Text fontWeight="bold" color="teal.700" fontSize="lg">
              Selected: {paymentMethodRadio.replace('_', ' ').toUpperCase()}
            </Text>
          </Box>

          <form onSubmit={submitHandler}>
            <VStack spacing="6" align="stretch">
              <RadioGroup.Root
                value={paymentMethodRadio}
                onValueChange={setPaymentMethodRadio}
              >
                <VStack align="start" spacing="4">
                  {/* PayPal Option */}
                  <Box
                    as="label"
                    cursor="pointer"
                    p="4"
                    borderRadius="lg"
                    border="2px solid"
                    borderColor={paymentMethodRadio === "paypal" ? "teal.500" : "gray.200"}
                    bg={paymentMethodRadio === "paypal" ? "teal.50" : "transparent"}
                    transition="all 0.2s"
                    _hover={{ borderColor: "teal.300", bg: "teal.50" }}
                    width="100%"
                  >
                    <RadioGroup.Item value="paypal">
                      <RadioGroup.ItemHiddenInput />
                      <HStack align="center" spacing="3">
                        <RadioGroup.ItemIndicator />
                        <Box flex="1">
                          <Text fontWeight="bold" fontSize="lg">
                            PayPal 
                          </Text>
                          
                        </Box>
                      </HStack>
                    </RadioGroup.Item>
                  </Box>

                  {/* Stripe Option */}
                  <Box
                    as="label"
                    cursor="pointer"
                    p="4"
                    borderRadius="lg"
                    border="2px solid"
                    borderColor={paymentMethodRadio === "stripe" ? "teal.500" : "gray.200"}
                    bg={paymentMethodRadio === "stripe" ? "teal.50" : "transparent"}
                    transition="all 0.2s"
                    _hover={{ borderColor: "teal.300", bg: "teal.50" }}
                    width="100%"
                  >
                    <RadioGroup.Item value="stripe">
                      <RadioGroup.ItemHiddenInput />
                      <HStack align="center" spacing="3">
                        <RadioGroup.ItemIndicator />
                        <Box flex="1">
                          <Text fontWeight="bold" fontSize="lg">
                            Stripe
                          </Text>
                          
                        </Box>
                      </HStack>
                    </RadioGroup.Item>
                  </Box>

                  {/* Bank Transfer Option */}
                  <Box
                    as="label"
                    cursor="pointer"
                    p="4"
                    borderRadius="lg"
                    border="2px solid"
                    borderColor={paymentMethodRadio === "bank_transfer" ? "teal.500" : "gray.200"}
                    bg={paymentMethodRadio === "bank_transfer" ? "teal.50" : "transparent"}
                    transition="all 0.2s"
                    _hover={{ borderColor: "teal.300", bg: "teal.50" }}
                    width="100%"
                  >
                    <RadioGroup.Item value="bank_transfer">
                      <RadioGroup.ItemHiddenInput />
                      <HStack align="center" spacing="3">
                        <RadioGroup.ItemIndicator />
                        <Box flex="1">
                          <Text fontWeight="bold" fontSize="lg">
                            Bank Transfer
                          </Text>
                          
                        </Box>
                      </HStack>
                    </RadioGroup.Item>
                  </Box>
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
                Continue with {paymentMethodRadio.replace('_', ' ')}
              </Button>
            </VStack>
          </form>
        </Box>
      </FormContainer>
    </Flex>
  );
};

export default PaymentScreen;