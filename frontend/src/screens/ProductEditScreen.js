import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Text,
  Spacer,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { createProduct, listProductDetails, updateProduct } from "../actions/productActions";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { PRODUCT_UPDATE_RESET, PRODUCT_CREATE_RESET } from "../constants/productConstants";

const ProductEditScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id: productId } = useParams();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [uploading, setUploading] = useState(false);

  // Check if we're in "add" mode
  const isAddMode = productId === "new";

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      navigate(`/admin/productlist`);
    }

    if (successCreate) {
      dispatch({ type: PRODUCT_CREATE_RESET });
      navigate(`/admin/productlist`);
    }

    if (!isAddMode) {
      // Edit mode - load product details
      if (!product.name || product._id !== productId) {
        dispatch(listProductDetails(productId));
      } else {
        setName(product.name);
        setPrice(product.price);
        setImage(product.image);
        setBrand(product.brand);
        setCategory(product.category);
        setCountInStock(product.countInStock);
        setDescription(product.description);
      }
    } else {
      // Add mode - reset all fields
      setName("");
      setPrice(0);
      setImage("");
      setBrand("");
      setCategory("");
      setCountInStock(0);
      setDescription("");
    }
  }, [
    dispatch,
    navigate,
    productId,
    product,
    successUpdate,
    successCreate,
    isAddMode,
  ]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (isAddMode) {
      // Create new product
      dispatch(
        createProduct({
          name,
          price,
          image,
          brand,
          category,
          description,
          countInStock,
        })
      );
    } else {
      // Update existing product
      dispatch(
        updateProduct({
          _id: productId,
          name,
          price,
          image,
          brand,
          category,
          description,
          countInStock,
        })
      );
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await axios.post(`/api/uploads`, formData, config);
      
      // Handle different response formats
      const imageUrl = data.image || data.path || data;
      setImage(imageUrl);
      
      setUploading(false);
    } catch (err) {
      console.error("Upload error:", err);
      setUploading(false);
    }
  };

  return (
    <>
      <Link as={RouterLink} to="/admin/productlist">
        Go Back
      </Link>

      <Flex w="full" alignItems="center" justifyContent="center" py="5">
        <FormContainer>
          <Heading as="h1" mb="8" fontSize="3xl">
            {isAddMode ? "Add Product" : "Edit Product"}
          </Heading>

          {loadingUpdate && <Loader />}
          {errorUpdate && <Message type="error">{errorUpdate}</Message>}
          {loadingCreate && <Loader />}
          {errorCreate && <Message type="error">{errorCreate}</Message>}

          {!isAddMode && loading ? (
            <Loader />
          ) : !isAddMode && error ? (
            <Message type="error">{error}</Message>
          ) : (
            <form onSubmit={submitHandler}>
              {/* NAME */}
              <FormControl id="name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter product name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
              <Spacer h="3" />

              {/* PRICE */}
              <FormControl id="price" isRequired>
                <FormLabel>Price</FormLabel>
                <Input
                  type="number"
                  placeholder="Enter price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </FormControl>
              <Spacer h="3" />

              {/* IMAGE */}
              <FormControl id="image">
                <FormLabel>Image URL</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter image URL"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
                <Spacer h="2" />
                <FormLabel>Or upload image</FormLabel>
                <Input
                  type="file"
                  onChange={uploadFileHandler}
                  accept="image/*"
                />
                {uploading && <Loader size="sm" />}
                {image && (
                  <Spacer h="2">
                    <Text fontSize="sm" color="green.500">
                      Image URL: {image}
                    </Text>
                  </Spacer>
                )}
              </FormControl>
              <Spacer h="3" />

              {/* BRAND */}
              <FormControl id="brand" isRequired>
                <FormLabel>Brand</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </FormControl>
              <Spacer h="3" />

              {/* CATEGORY */}
              <FormControl id="category" isRequired>
                <FormLabel>Category</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </FormControl>
              <Spacer h="3" />

              {/* COUNT IN STOCK */}
              <FormControl id="countInStock" isRequired>
                <FormLabel>Count In Stock</FormLabel>
                <Input
                  type="number"
                  placeholder="Enter quantity in stock"
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}
                  min="0"
                />
              </FormControl>
              <Spacer h="3" />

              {/* DESCRIPTION */}
              <FormControl id="description" isRequired>
                <FormLabel>Description</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FormControl>
              <Spacer h="3" />

              <Button
                type="submit"
                isLoading={isAddMode ? loadingCreate : loadingUpdate}
                loadingText={isAddMode ? "Creating..." : "Updating..."}
                colorScheme="teal"
                mt="4"
                size="lg"
                width="full"
              >
                {isAddMode ? "Create Product" : "Update Product"}
              </Button>
            </form>
          )}
        </FormContainer>
      </Flex>
    </>
  );
};

export default ProductEditScreen;