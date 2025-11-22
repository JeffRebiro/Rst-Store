import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Image,
  Select,
  Text,
  Textarea,
  Spinner,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";

import {
  createProductReview,
  listProductDetails,
} from "../actions/productActions";
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

  const productReviewCreate = useSelector(
    (state) => state.productReviewCreate
  );
  const { success: successProductReview, error: errorProductReview } =
    productReviewCreate;

  useEffect(() => {
    if (successProductReview) {
      alert("Review submitted");
      setRating(1);
      setComment("");
      dispatch({ type: PRODUCT_REVIEW_CREATE_RESET });
    }
    dispatch(listProductDetails(id));
  }, [id, dispatch, successProductReview]);

  const addToCartHandler = () => {
    navigate(`/cart/${id}?qty=${qty}`);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createProductReview(id, { rating, comment }));
  };

  return (
    <>
      <Flex mb="5">
        <Button as={RouterLink} to="/" colorScheme="teal" variant="outline">
          Go Back
        </Button>
      </Flex>

      {loading ? (
        <Flex alignItems="center" justifyContent="center">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Flex>
      ) : error ? (
        <Box
          bg="red.100"
          border="1px"
          borderColor="red.300"
          color="red.800"
          px="4"
          py="3"
          borderRadius="md"
          mb="4"
        >
          {error}
        </Box>
      ) : product ? (
        <>
          <Grid
            templateColumns={{ sm: "1fr", md: "2fr 1fr" }}
            gap="10"
            py="8"
            px="5"
            borderRadius="lg"
            boxShadow="md"
            bg="white"
          >
            {/* Product Image */}
            <Image
              src={product?.image}
              alt={product?.name}
              borderRadius="md"
              objectFit="cover"
              boxShadow="sm"
            />

            {/* Product Details */}
            <Flex direction="column" justifyContent="space-between">
              <Box>
                <Heading as="h1" fontSize="3xl" mb="4" color="teal.600">
                  {product?.name}
                </Heading>
                <Text fontSize="lg" color="gray.500" mb="4">
                  {product?.brand}
                </Text>
                <Flex align="center" gap="1" mb="4">
                  <Text color="yellow.500" fontSize="lg">
                    {'★'.repeat(Math.floor(product?.rating))}
                    {'☆'.repeat(5 - Math.floor(product?.rating))}
                  </Text>
                  <Text fontSize="sm">
                    {`${product?.numReviews || 0} reviews`}
                  </Text>
                </Flex>
                <Text fontSize="xl" fontWeight="bold" color="teal.800">
                  ${product?.price}
                </Text>
                <Text mt="4" color="gray.700">
                  {product?.description}
                </Text>
              </Box>

              {/* Add to Cart Section */}
              <Box mt="8" p="6" bg="gray.50" borderRadius="lg" boxShadow="sm">
                <Flex justifyContent="space-between" mb="4">
                  <Text>Price:</Text>
                  <Text fontWeight="bold">${product?.price}</Text>
                </Flex>
                <Flex justifyContent="space-between" mb="4">
                  <Text>Status:</Text>
                  <Text fontWeight="bold">
                    {product?.countInStock > 0 ? "In Stock" : "Out of Stock"}
                  </Text>
                </Flex>
                {product?.countInStock > 0 && (
                  <Flex justifyContent="space-between" mb="4">
                    <Text>Qty:</Text>
                    <Select
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                      width="30%"
                    >
                      {[...Array(product?.countInStock).keys()].map((i) => (
                        <option value={i + 1} key={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </Select>
                  </Flex>
                )}
                <Button
                  width="100%"
                  colorScheme="teal"
                  isDisabled={product?.countInStock === 0}
                  onClick={addToCartHandler}
                >
                  Add to Cart
                </Button>
              </Box>
            </Flex>
          </Grid>

          {/* Review Section */}
          <Box mt="10" p="6" bg="white" borderRadius="lg" boxShadow="sm">
            <Heading as="h3" size="lg" mb="6">
              Write a Review
            </Heading>

            {product?.reviews?.length === 0 ? (
              <Box
                bg="blue.100"
                border="1px"
                borderColor="blue.300"
                color="blue.800"
                px="4"
                py="3"
                borderRadius="md"
                mb="4"
              >
                No Reviews
              </Box>
            ) : (
              product?.reviews?.map((review) => (
                <Box
                  key={review._id}
                  p="4"
                  borderBottom="1px"
                  borderColor="gray.200"
                  mb="4"
                >
                  <Flex justifyContent="space-between" alignItems="center">
                    <Text fontWeight="bold">{review.name}</Text>
                    <Flex align="center" gap="1">
                      <Text color="red.500" fontSize="lg">
                        {'★'.repeat(Math.floor(review.rating))}
                        {'☆'.repeat(5 - Math.floor(review.rating))}
                      </Text>
                    </Flex>
                  </Flex>
                  <Text mt="2" color="gray.600">
                    {review.comment}
                  </Text>
                </Box>
              ))
            )}

            {errorProductReview && (
              <Box
                bg="red.100"
                border="1px"
                borderColor="red.300"
                color="red.800"
                px="4"
                py="3"
                borderRadius="md"
                mb="4"
              >
                {errorProductReview}
              </Box>
            )}

            {userInfo ? (
              <form onSubmit={submitHandler}>
                <Box mb="4">
                  <Text as="label" display="block" mb="2" fontWeight="medium">
                    Rating
                  </Text>
                  <Select
                    placeholder="Select Option"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                  >
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Okay</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                  </Select>
                </Box>

                <Box mb="4">
                  <Text as="label" display="block" mb="2" fontWeight="medium">
                    Comment
                  </Text>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your review here..."
                  />
                </Box>

                <Button type="submit" colorScheme="teal">
                  Submit Review
                </Button>
              </form>
            ) : (
              <Box
                bg="blue.100"
                border="1px"
                borderColor="blue.300"
                color="blue.800"
                px="4"
                py="3"
                borderRadius="md"
                mb="4"
              >
                Please log in to write a review
              </Box>
            )}
          </Box>
        </>
      ): null}
    </>
  );
};

export default ProductScreen;