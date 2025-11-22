import { Flex, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <Flex justifyContent="center" mb="8" gap="4" alignItems="center">
      {/* Step 1: Login */}
      <Flex alignItems="center" gap="4">
        <Text
          as={step1 ? RouterLink : Text}
          to={step1 ? "/login" : undefined}
          color={step1 ? "teal.600" : "gray.400"}
          fontWeight={step1 ? "bold" : "normal"}
          _hover={step1 ? { textDecoration: "underline" } : undefined}
          cursor={step1 ? "pointer" : "default"}
        >
          Login
        </Text>
        {step2 && <Text color="gray.500">›</Text>}
      </Flex>

      {/* Step 2: Shipping */}
      <Flex alignItems="center" gap="4">
        <Text
          as={step2 ? RouterLink : Text}
          to={step2 ? "/shipping" : undefined}
          color={step2 ? "teal.600" : "gray.400"}
          fontWeight={step2 ? "bold" : "normal"}
          _hover={step2 ? { textDecoration: "underline" } : undefined}
          cursor={step2 ? "pointer" : "default"}
        >
          Shipping
        </Text>
        {step3 && <Text color="gray.500">›</Text>}
      </Flex>

      {/* Step 3: Payment */}
      <Flex alignItems="center" gap="4">
        <Text
          as={step3 ? RouterLink : Text}
          to={step3 ? "/payment" : undefined}
          color={step3 ? "teal.600" : "gray.400"}
          fontWeight={step3 ? "bold" : "normal"}
          _hover={step3 ? { textDecoration: "underline" } : undefined}
          cursor={step3 ? "pointer" : "default"}
        >
          Payment
        </Text>
        {step4 && <Text color="gray.500">›</Text>}
      </Flex>

      {/* Step 4: Place Order */}
      <Text
        as={step4 ? RouterLink : Text}
        to={step4 ? "/placeorder" : undefined}
        color={step4 ? "teal.600" : "gray.400"}
        fontWeight={step4 ? "bold" : "normal"}
        _hover={step4 ? { textDecoration: "underline" } : undefined}
        cursor={step4 ? "pointer" : "default"}
      >
        Place Order
      </Text>
    </Flex>
  );
};

export default CheckoutSteps;