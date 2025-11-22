import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

const ProductScreen = () => {
  const { id } = useParams();

  return (
    <>
      <Flex mb="5">
        <Button>Go Back</Button>
      </Flex>
      <Box>
        <Text>Product ID: {id}</Text>
        <Text>Minimal test - no components</Text>
      </Box>
    </>
  );
};

export default ProductScreen;