import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

import Loader from "../components/Loader";
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
        <Rating value={3.5} text="123 reviews" />
        <Rating value={4} text="456 reviews" color="blue.500" />
      </Box>
    </>
  );
};

export default ProductScreen;