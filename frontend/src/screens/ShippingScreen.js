import {
  Button,
  Flex,
  Input,
  VStack,
  Box,
  Heading,
  Text,
  NativeSelect,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveShippingAddress } from "../actions/cartActions";
import CheckoutSteps from "../components/CheckoutSteps";
import { countries } from "../data/countries";
import FormContainer from "../components/FormContainer";

const ShippingScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "");

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [navigate, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    
    // Validate that all fields are filled
    if (!address || !city || !postalCode || !country) {
      alert('Please fill in all fields');
      return;
    }

    console.log('Submitting shipping address:', { address, city, postalCode, country });
    
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate("/payment");
  };

  const handleCountryChange = (e) => {
    const selectedCountry = e.value;
    console.log('Country selected:', selectedCountry);
    setCountry(selectedCountry);
  };

  return (
    <Flex w="full" alignItems="center" justifyContent="center" py="10">
      <FormContainer>
        <Heading as="h2" mb="8" fontSize="3xl" fontWeight="bold">
          Shipping Address
        </Heading>

        {/* Checkout Steps */}
        <Box mb="8">
          <CheckoutSteps step1 step2 />
        </Box>

        {/* Shipping Form */}
        <form onSubmit={submitHandler}>
          <VStack spacing="6" align="stretch">
            {/* Address Field */}
            <Box>
              <Text as="label" display="block" mb="2" fontWeight="medium">
                Address
              </Text>
              <Input
                type="text"
                placeholder="Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                focusBorderColor="teal.500"
                required
              />
            </Box>

            {/* City Field */}
            <Box>
              <Text as="label" display="block" mb="2" fontWeight="medium">
                City
              </Text>
              <Input
                type="text"
                placeholder="Enter your city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                focusBorderColor="teal.500"
                required
              />
            </Box>

            {/* Postal Code Field */}
            <Box>
              <Text as="label" display="block" mb="2" fontWeight="medium">
                Postal Code
              </Text>
              <Input
                type="text"
                placeholder="Enter your postal code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                focusBorderColor="teal.500"
                required
              />
            </Box>

            {/* Country Field */}
            <Box>
              <Text as="label" display="block" mb="2" fontWeight="medium">
                Country
              </Text>
              <NativeSelect.Root
                value={country}
                onValueChange={handleCountryChange}
              >
                <NativeSelect.Field 
                  placeholder="Select your country"
                  focusBorderColor="teal.500"
                >
                  <option value="">Select your country</option>
                  {countries.map((countryOption) => (
                    <option key={countryOption} value={countryOption}>
                      {countryOption}
                    </option>
                  ))}
                </NativeSelect.Field>
              </NativeSelect.Root>
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              colorPalette="teal"
              size="lg"
              w="full"
              _hover={{ bg: "teal.600" }}
            >
              Continue
            </Button>
          </VStack>
        </form>
      </FormContainer>
    </Flex>
  );
};

export default ShippingScreen;