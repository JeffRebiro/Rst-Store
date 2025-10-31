
 import {
   Button,
   Flex,
   FormControl,
   FormLabel,
   Heading,
   Input,
   Select,
   Spacer,
   VStack,
   Box,
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

   const submitHandler = (e) => {
     e.preventDefault();
     dispatch(saveShippingAddress({ address, city, postalCode, country }));
     navigate("/payment");
   };

   useEffect(() => {
     if (!userInfo) {
       navigate("/login");
     }
   }, [navigate, userInfo]);

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
             <FormControl id="address" isRequired>
               <FormLabel>Address</FormLabel>
               <Input
                 type="text"
                 placeholder="Enter your address"
                 value={address}
                 onChange={(e) => setAddress(e.target.value)}
                 focusBorderColor="teal.500"
               />
             </FormControl>

             {/* City Field */}
             <FormControl id="city" isRequired>
               <FormLabel>City</FormLabel>
               <Input
                 type="text"
                 placeholder="Enter your city"
                 value={city}
                 onChange={(e) => setCity(e.target.value)}
                 focusBorderColor="teal.500"
               />
             </FormControl>

             {/* Postal Code Field */}
             <FormControl id="postalCode" isRequired>
               <FormLabel>Postal Code</FormLabel>
               <Input
                 type="text"
                 placeholder="Enter your postal code"
                 value={postalCode}
                 onChange={(e) => setPostalCode(e.target.value)}
                 focusBorderColor="teal.500"
               />
             </FormControl>

             {/* Country Field */}
             <FormControl id="country" isRequired>
               <FormLabel>Country</FormLabel>
               <Select
                 value={country}
                 onChange={(e) => setCountry(e.target.value)}
                 placeholder="Select your country"
                 focusBorderColor="teal.500"
               >
                 {countries.map((country) => (
                   <option key={country} value={country}>
                     {country}
                   </option>
                 ))}
               </Select>
             </FormControl>

             {/* Submit Button */}
             <Button
               type="submit"
               colorScheme="teal"
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





