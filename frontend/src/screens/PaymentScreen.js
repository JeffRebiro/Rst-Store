import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  VStack,
  Box,
  useColorModeValue,
  HStack,
  useRadioGroup,
  useRadio,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { savePaymentMethod } from "../actions/cartActions";
import CheckoutSteps from "../components/CheckoutSteps";
import FormContainer from "../components/FormContainer";

// Radio Card component following Chakra compound pattern
const RadioCard = (props) => {
  const { getInputProps, getCheckboxProps } = useRadio(props);
  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{ bg: "teal.500", color: "white", borderColor: "teal.500" }}
        _focus={{ boxShadow: "outline" }}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  );
};

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
    if (!userInfo) navigate("/login");
    if (!shippingAddress) navigate("/shipping");
  }, [navigate, shippingAddress, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethodRadio));
    navigate("/placeorder");
  };

  // Options array
  const options = ["paypal"]; // Add more options here if needed

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "paymentMethod",
    value: paymentMethodRadio,
    onChange: setPaymentMethodRadio,
  });

  const group = getRootProps();

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
              {/* Payment Method Options */}
              <FormControl as="fieldset">
                <FormLabel as="legend" fontWeight="bold">
                  Payment Options
                </FormLabel>
                <HStack {...group} spacing="4">
                  {options.map((value) => {
                    const radio = getRadioProps({ value });
                    return (
                      <RadioCard key={value} {...radio}>
                        {value === "paypal"
                          ? "PayPal or Credit/Debit Card"
                          : value}
                      </RadioCard>
                    );
                  })}
                </HStack>
              </FormControl>

              {/* Submit Button */}
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
