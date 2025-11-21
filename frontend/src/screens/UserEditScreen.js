import {
  Button,
  Checkbox,
  Flex,
  Heading,
  Input,
  Link,
  Spacer,
  FieldRoot,
  FieldLabel,
  FieldErrorText,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";

import { getUserDetails, updateUser } from "../actions/userActions";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { USER_UPDATE_RESET } from "../constants/userConstants";

const UserEditScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: userId } = useParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userUpdate = useSelector((state) => state.userUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = userUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET });
      navigate("/admin/userlist");
    } else {
      if (!user.name || user._id !== userId) {
        dispatch(getUserDetails(userId));
      } else {
        setName(user.name);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
      }
    }
  }, [dispatch, userId, user, successUpdate, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUser({ _id: userId, name, email, isAdmin }));
  };

  return (
    <>
      <Link as={RouterLink} to="/admin/userlist">
        Go Back
      </Link>
      <Flex w="full" alignItems="center" justifyContent="center" py="5">
        <FormContainer>
          <Heading as="h1" mb="8" fontSize="3xl">
            Edit User
          </Heading>

          {loadingUpdate && <Loader />}
          {errorUpdate && <Message type="error">{errorUpdate}</Message>}

          {loading ? (
            <Loader />
          ) : error ? (
            <Message type="error">{error}</Message>
          ) : (
            <form onSubmit={submitHandler}>
              <FieldRoot>
                <FieldLabel>Name</FieldLabel>
                <Input
                  type="text"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FieldRoot>
              <Spacer h="3" />

              <FieldRoot>
                <FieldLabel>Email Address</FieldLabel>
                <Input
                  type="text"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FieldRoot>
              <Spacer h="3" />

              <FieldRoot>
                <FieldLabel>Is Admin?</FieldLabel>
                <Checkbox
                  size="lg"
                  colorScheme="teal"
                  isChecked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                >
                  Is Admin?
                </Checkbox>
              </FieldRoot>
              <Spacer h="3" />

              <Button type="submit" isLoading={loading} colorScheme="teal" mt="4">
                Update
              </Button>
            </form>
          )}
        </FormContainer>
      </Flex>
    </>
  );
};

export default UserEditScreen;
