import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

import Loader from "../components/Loader";
import Message from "../components/Message";
import Rating from "../components/Rating";

const ProductScreen = () => {
  const { id } = useParams();

  return (
    <>
      <Flex mb="5">
        <Button>Go Back</Button>
      </Flex>
      <Box>
        <Text>Product ID: {id}</Text>
        <Loader />
        <Message type="info">This is an info message</Message>
        <Message type="error">This is an error message</Message>
        <Rating value={3.5} text="123 reviews" />
        <Rating value={4} text="456 reviews" color="blue.500" />
      </Box>
    </>
  );
};

export default ProductScreen;