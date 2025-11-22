import {
  Button,
  Flex,
  Field,
  Heading,
  VStack,
  Box,
  Text,
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

  // Custom radio option component
  const RadioOption = ({ value, label, isSelected, onChange }) => (
    <Box
      as="label"
      display="flex"
      alignItems="center"
      gap="3"
      p="3"
      border="2px solid"
      borderColor={isSelected ? "teal.500" : "gray.200"}
      borderRadius="md"
      cursor="pointer"
      bg={isSelected ? "teal.50" : "transparent"}
      _hover={{ borderColor: "teal.300" }}
      _dark={{
        borderColor: isSelected ? "teal.300" : "gray.600",
        bg: isSelected ? "teal.900" : "transparent",
      }}
    >
      <Box
        width="4"
        height="4"
        borderRadius="full"
        border="2px solid"
        borderColor={isSelected ? "teal.500" : "gray.400"}
        display="flex"
        alignItems="center"
        justifyContent="center"
        _dark={{
          borderColor: isSelected ? "teal.300" : "gray.400",
        }}
      >
        {isSelected && (
          <Box
            width="2"
            height="2"
            borderRadius="full"
            bg="teal.500"
            _dark={{ bg: "teal.300" }}
          />
        )}
      </Box>
      <input
        type="radio"
        value={value}
        checked={isSelected}
        onChange={() => onChange(value)}
        style={{ display: 'none' }}
      />
      <Text fontSize="lg" fontWeight="medium">
        {label}
      </Text>
    </Box>
  );

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
                <Field.Label fontWeight="semibold" fontSize="lg" mb="4">
                  Choose your payment method
                </Field.Label>
                <VStack align="stretch" gap="3">
                  <RadioOption
                    value="paypal"
                    label="PayPal or Credit/Debit Card"
                    isSelected={paymentMethodRadio === "paypal"}
                    onChange={setPaymentMethodRadio}
                  />
                  {/* Additional payment options can be added here */}
                  {/* <RadioOption
                    value="stripe"
                    label="Stripe"
                    isSelected={paymentMethodRadio === "stripe"}
                    onChange={setPaymentMethodRadio}
                  /> */}
                </VStack>
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