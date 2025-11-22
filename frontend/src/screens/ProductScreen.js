import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";

const ProductScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [qty, setQty] = useState(1);

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  return (
    <>
      <Flex mb="5">
        <Button as={RouterLink} to="/" colorScheme="teal" variant="outline">
          Go Back
        </Button>
      </Flex>

      <Box>
        <Text>Product ID: {id}</Text>
        {loading && <Text>Loading...</Text>}
        {error && <Text color="red.500">Error: {error}</Text>}
        {product && (
          <Box>
            <Text fontSize="2xl">{product.name}</Text>
            <Text>Price: ${product.price}</Text>
            <Text>Description: {product.description}</Text>
          </Box>
        )}
      </Box>
    </>
  );
};

export default ProductScreen;