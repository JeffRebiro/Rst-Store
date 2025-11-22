import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

// Test Loader first
import Loader from "../components/Loader";

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
      </Box>
    </>
  );
};

export default ProductScreen;