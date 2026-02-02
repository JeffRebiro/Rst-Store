import {
  Box,
  Button,
  Flex,
  Field,
  Grid,
  Heading,
  Image,
  NativeSelect,
  Text,
  Textarea,
  VStack,
  Separator,
  Stack,
  Badge,
  Link,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";

import { createProductReview, listProductDetails } from "../actions/productActions";
import { addToCart } from "../actions/cartActions";   // ✅ Import addToCart
import Loader from "../components/Loader";
import Message from "../components/Message";
import Rating from "../components/Rating";
import { PRODUCT_REVIEW_CREATE_RESET } from "../constants/productConstants";

const ProductScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const { success: successProductReview, error: errorProductReview } = productReviewCreate;

  useEffect(() => {
    if (successProductReview) {
      alert("Review submitted successfully!");
      setRating(1);
      setComment("");
      dispatch({ type: PRODUCT_REVIEW_CREATE_RESET });
    }
    dispatch(listProductDetails(id));
  }, [id, dispatch, successProductReview]);

  // ✅ Fixed Add to Cart Handler
  const addToCartHandler = () => {
    dispatch(addToCart(id, qty));   // Add product directly
    navigate("/cart");              // Navigate without id/qty in URL
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createProductReview(id, { rating, comment }));
  };

  return (
    <>
      {/* Back Button */}
      <Flex mb="5">
        <Button asChild colorPalette="teal" variant="outline" size="sm">
          <RouterLink to="/">← Back to Home</RouterLink>
        </Button>
      </Flex>

      {/* Product Details */}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message type="error">{error}</Message>
      ) : (
        <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap="10" py="8" px={{ base: "2", md: "8" }}>
          {/* Product Image */}
          <Flex align="center" justify="center" p="4">
            <Image src={product.image} alt={product.name} objectFit="contain" w="100%" maxH="500px" />
          </Flex>

          {/* Product Info */}
          <Flex direction="column" justify="space-between" bg="white" p="6" rounded="lg" shadow="md">
            <VStack align="flex-start" gap="4">
              <Heading fontSize="2xl" color="teal.600">{product.name}</Heading>
              <Text fontSize="lg" color="gray.600">Brand: <strong>{product.brand}</strong></Text>
              <Flex align="center">
                <Rating value={product.rating} text={`${product.numReviews} Reviews`} />
              </Flex>
              <Separator />
              <Text fontSize="2xl" fontWeight="bold" color="teal.800">₹{product.price}</Text>

              <Badge colorPalette={product.countInStock > 0 ? "green" : "red"} fontSize="md" p="1" borderRadius="md">
                {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
              </Badge>

              <Text mt="4" color="gray.700" lineHeight="1.6">{product.description}</Text>
            </VStack>

            {/* Cart Interaction */}
            <Box mt="8">
              {product.countInStock > 0 && (
                <Flex align="center" mb="4">
                  <Text mr="4">Qty:</Text>
                  <NativeSelect.Root value={qty} onValueChange={({ value }) => setQty(Number(value))} maxW="100px">
                    <NativeSelect.Field borderColor="teal.500">
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                      ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Flex>
              )}
              <Button
                colorPalette="teal"
                width="full"
                onClick={addToCartHandler}
                disabled={product.countInStock === 0}
                size="lg"
                _hover={{ bg: "teal.600" }}
              >
                {product.countInStock > 0 ? "Add to Cart" : "Out of Stock"}
              </Button>
            </Box>
          </Flex>
        </Grid>
      )}

      {/* Review Section */}
      {!loading && !error && (
        <Box mt="12" p={{ base: "4", md: "8" }} bg="white" borderRadius="lg" boxShadow="md">
          <Heading as="h3" size="lg" mb="6" color="teal.700">
            Customer Reviews
          </Heading>

          {product.reviews.length === 0 ? (
            <Message>No Reviews Yet</Message>
          ) : (
            <Stack gap="6">
              {product.reviews.map((review) => (
                <Box key={review._id} p="4" bg="gray.50" borderRadius="md" shadow="sm">
                  <Flex justify="space-between" align="center" mb="2">
                    <Text fontWeight="bold">{review.name}</Text>
                    <Rating value={review.rating} />
                  </Flex>
                  <Text color="gray.600">{review.comment}</Text>
                </Box>
              ))}
            </Stack>
          )}

          <Box mt="8">
            {errorProductReview && <Message type="error">{errorProductReview}</Message>}

            {userInfo ? (
              <form onSubmit={submitHandler}>
                <Stack gap="4">
                  <Field.Root id="rating">
                    <Field.Label>Rating</Field.Label>
                    <NativeSelect.Root value={rating} onValueChange={({ value }) => setRating(Number(value))}>
                      <NativeSelect.Field placeholder="Select Rating">
                        <option value="1">1 - Poor</option>
                        <option value="2">2 - Fair</option>
                        <option value="3">3 - Good</option>
                        <option value="4">4 - Very Good</option>
                        <option value="5">5 - Excellent</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Field.Root>

                  <Field.Root id="comment">
                    <Field.Label>Comment</Field.Label>
                    <Textarea
                      placeholder="Write your review..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </Field.Root>

                  <Button type="submit" colorPalette="teal">
                    Submit Review
                  </Button>
                </Stack>
              </form>
            ) : (
              <Message>
                Please <Link asChild color="teal.500"><RouterLink to="/login">login</RouterLink></Link> to write a review
              </Message>
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

export default ProductScreen;
