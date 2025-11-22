import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Table,
  Text,
  Stack,
  Dialog,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { IoAdd, IoPencilSharp, IoTrashBinSharp, IoSearch } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  createProduct,
  deleteProduct,
  listProducts,
} from "../actions/productActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { PRODUCT_CREATE_RESET } from "../constants/productConstants";

const ProductListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productDelete = useSelector((state) => state.productDelete);
  const { loading: loadingDelete, error: errorDelete, success: successDelete } = productDelete;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });

    if (!userInfo || !userInfo.isAdmin) {
      navigate("/login");
    }

    if (successCreate) {
      navigate(`/admin/product/${createdProduct._id}/edit`);
    } else {
      dispatch(listProducts());
    }
  }, [dispatch, navigate, userInfo, successDelete, successCreate, createdProduct]);

  const deleteHandler = (id) => {
    setDeleteId(id);
    setDialogOpen(true);
  };

  const confirmDeleteHandler = () => {
    dispatch(deleteProduct(deleteId));
    setDialogOpen(false);
  };

  const createProductHandler = () => {
    dispatch(createProduct());
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Flex
        mb="5"
        alignItems={{ base: "flex-start", md: "center" }}
        justifyContent="space-between"
        flexDirection={{ base: "column", md: "row" }}
        gap={{ base: 4, md: 0 }}
      >
        <Heading as="h1" fontSize={{ base: "2xl", md: "3xl" }}>
          Products
        </Heading>
        <Button
          onClick={createProductHandler}
          colorPalette="teal"
          size={{ base: "md", md: "lg" }}
        >
          <IoAdd style={{ marginRight: '8px' }} />
          Create Product
        </Button>
      </Flex>

      {/* Search Input - Simple approach */}
      <Box position="relative" mb="4" maxWidth="400px">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          paddingRight="3rem"
        />
        <Box
          position="absolute"
          right="0.75rem"
          top="50%"
          transform="translateY(-50%)"
          color="gray.500"
          pointerEvents="none"
        >
          <IoSearch />
        </Box>
      </Box>

      {loadingDelete && <Loader />}
      {errorDelete && <Message type="error">{errorDelete}</Message>}
      {loadingCreate && <Loader />}
      {errorCreate && <Message type="error">{errorCreate}</Message>}

      {loading ? (
        <Loader />
      ) : error ? (
        <Message type="error">{error}</Message>
      ) : (
        <Box
          bg="white"
          rounded="lg"
          shadow="lg"
          px={{ base: 2, md: 5 }}
          py={{ base: 2, md: 5 }}
          mt="4"
          mx={{ base: 2, md: 5 }}
          _dark={{ bg: "gray.800" }}
        >
          {/* Desktop View */}
          <Box hideBelow="md">
            <Box overflowX="auto">
              <Table.Root size="sm">
                <Table.Header bg="gray.100" _dark={{ bg: "gray.700" }}>
                  <Table.Row>
                    <Table.ColumnHeader>ID</Table.ColumnHeader>
                    <Table.ColumnHeader>NAME</Table.ColumnHeader>
                    <Table.ColumnHeader>PRICE</Table.ColumnHeader>
                    <Table.ColumnHeader>CATEGORY</Table.ColumnHeader>
                    <Table.ColumnHeader>BRAND</Table.ColumnHeader>
                    <Table.ColumnHeader>ACTIONS</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {filteredProducts.map((product) => (
                    <Table.Row 
                      key={product._id} 
                      _hover={{ bg: "gray.50" }}
                      _dark={{ _hover: { bg: "gray.700" } }}
                    >
                      <Table.Cell>{product._id}</Table.Cell>
                      <Table.Cell>{product.name}</Table.Cell>
                      <Table.Cell>₹{product.price?.toFixed(2)}</Table.Cell>
                      <Table.Cell>{product.category}</Table.Cell>
                      <Table.Cell>{product.brand}</Table.Cell>
                      <Table.Cell>
                        <Flex gap="2" justify="flex-end">
                          <Button
                            asChild
                            colorPalette="teal"
                            size="sm"
                            variant="outline"
                          >
                            <RouterLink to={`/admin/product/${product._id}/edit`}>
                              <IoPencilSharp style={{ marginRight: '4px' }} />
                              Edit
                            </RouterLink>
                          </Button>
                          <Button
                            colorPalette="red"
                            size="sm"
                            onClick={() => deleteHandler(product._id)}
                          >
                            <IoTrashBinSharp style={{ marginRight: '4px' }} />
                            Delete
                          </Button>
                        </Flex>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          </Box>

          {/* Mobile View */}
          <Box hideFrom="md">
            <Stack gap="4">
              {filteredProducts.map((product) => (
                <Box
                  key={product._id}
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  shadow="sm"
                  p="4"
                  bg="white"
                  _dark={{ bg: "gray.800" }}
                >
                  <Flex justifyContent="space-between" alignItems="center" mb="2">
                    <Text fontSize="sm" fontWeight="bold" color="gray.600">
                      ID: {product._id}
                    </Text>
                    <Flex gap="2" direction="column">
                      <Button
                        asChild
                        colorPalette="teal"
                        size="sm"
                        variant="outline"
                      >
                        <RouterLink to={`/admin/product/${product._id}/edit`}>
                          <IoPencilSharp style={{ marginRight: '4px' }} />
                          Edit
                        </RouterLink>
                      </Button>
                      <Button
                        colorPalette="red"
                        size="sm"
                        onClick={() => deleteHandler(product._id)}
                      >
                        <IoTrashBinSharp style={{ marginRight: '4px' }} />
                        Delete
                      </Button>
                    </Flex>
                  </Flex>
                  <Text fontWeight="medium" color="gray.700" _dark={{ color: "white" }}>
                    {product.name}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Price: ₹{product.price?.toFixed(2)}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Category: {product.category}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Brand: {product.brand}
                  </Text>
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>
      )}

      {/* Confirm Delete Dialog */}
      <Dialog.Root 
        open={dialogOpen} 
        onOpenChange={(e) => setDialogOpen(e.open)}
        placement="center"
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Confirm Delete</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>Are you sure you want to delete this product?</Dialog.Body>
            <Dialog.Footer>
              <Button colorPalette="red" mr="3" onClick={confirmDeleteHandler}>
                Delete
              </Button>
              <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </>
  );
};

export default ProductListScreen;