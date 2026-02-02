import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Box,
  VStack,
  IconButton,
  Image,
  Field,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { listProductDetails, updateProduct } from "../actions/productActions";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { PRODUCT_UPDATE_RESET } from "../constants/productConstants";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import { toaster } from "../components/ui/toaster"; // Import your toaster

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
  const [countInStock, setCountInStock] = useState("");
  const [uploading, setUploading] = useState(false);

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate;

  useEffect(() => {
    if (successUpdate) {
      toaster.create({
        title: "Product Updated.",
        status: "success",
        duration: 3000,
      });
      dispatch({ type: PRODUCT_UPDATE_RESET });
      navigate(`/admin/productlist`);
    } else {
      if (!product.name || product._id !== productId) {
        dispatch(listProductDetails(productId));
      } else {
        setName(product.name);
        setPrice(product.price);
        setImage(product.image); // ✅ existing image preserved
        setBrand(product.brand);
        setCategory(product.category);
        setCountInStock(product.countInStock);
        setDescription(product.description);
      }
    }
  }, [dispatch, navigate, productId, product, successUpdate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateProduct({
        _id: productId,
        name,
        price,
        image, // ✅ will keep old image if unchanged
        brand,
        category,
        description,
        countInStock,
      })
    );
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      const { data } = await axios.post(`/api/uploads`, formData, config);

      setImage(data.url || data.secure_url || data);
      setUploading(false);
      toaster.create({
        title: "Image uploaded",
        status: "success",
        duration: 2000,
      });
    } catch (err) {
      console.error(err);
      setUploading(false);
      toaster.create({
        title: "Upload failed",
        status: "error",
        duration: 3000,
      });
    }
  };

  return (
    <>
      <Box px={8} py={4}>
        <IconButton asChild aria-label="Go Back" mb={5} colorPalette="teal">
          <RouterLink to="/admin/productlist">
            <FaArrowLeft />
          </RouterLink>
        </IconButton>

        <Flex w="full" alignItems="center" justifyContent="center" py="5">
          <FormContainer>
            <Heading as="h1" mb="8" fontSize="3xl">
              Edit Product
            </Heading>

            {loadingUpdate && <Loader />}
            {errorUpdate && <Message type="error">{errorUpdate}</Message>}

            {loading ? (
              <Loader />
            ) : error ? (
              <Message type="error">{error}</Message>
            ) : (
              <form onSubmit={submitHandler}>
                <VStack gap={4}>
                  {/* NAME */}
                  <Field.Root required>
                    <Field.Label>Name</Field.Label>
                    <Input
                      type="text"
                      placeholder="Enter name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Field.Root>

                  {/* PRICE */}
                  <Field.Root required>
                    <Field.Label>Price</Field.Label>
                    <Input
                      type="number"
                      placeholder="Enter price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </Field.Root>

                  {/* IMAGE */}
                  <Field.Root>
                    <Field.Label>Image</Field.Label>
                    <Input
                      type="text"
                      placeholder="Enter image URL"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                    />
                    <Input
                      type="file"
                      onChange={uploadFileHandler}
                      css={{ marginTop: "2" }}
                    />
                    {uploading && <Box>Uploading...</Box>}
                    {image && (
                      <Image
                        src={image}
                        alt="preview"
                        css={{
                          width: "150px",
                          height: "150px",
                          objectFit: "cover",
                          marginTop: "2",
                        }}
                      />
                    )}
                  </Field.Root>

                  {/* DESCRIPTION */}
                  <Field.Root required>
                    <Field.Label>Description</Field.Label>
                    <Input
                      type="text"
                      placeholder="Enter description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </Field.Root>

                  {/* BRAND */}
                  <Field.Root required>
                    <Field.Label>Brand</Field.Label>
                    <Input
                      type="text"
                      placeholder="Enter brand"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                    />
                  </Field.Root>

                  {/* CATEGORY */}
                  <Field.Root required>
                    <Field.Label>Category</Field.Label>
                    <Input
                      type="text"
                      placeholder="Enter category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    />
                  </Field.Root>

                  {/* COUNT IN STOCK */}
                  <Field.Root required>
                    <Field.Label>Count In Stock</Field.Label>
                    <Input
                      type="number"
                      placeholder="Product in stock"
                      value={countInStock}
                      onChange={(e) => setCountInStock(e.target.value)}
                    />
                  </Field.Root>

                  <Button
                    type="submit"
                    loading={loadingUpdate}
                    colorPalette="teal"
                    width="full"
                    css={{ marginTop: "4" }}
                  >
                    Update Product
                  </Button>
                </VStack>
              </form>
            )}
          </FormContainer>
        </Flex>
      </Box>
    </>
  );
};

export default ProductEditScreen;
