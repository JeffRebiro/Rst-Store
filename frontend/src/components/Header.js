import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Link,
  Menu,
  Portal,
} from "@chakra-ui/react";
import { HiOutlineMenuAlt3, HiShoppingBag, HiUser } from "react-icons/hi";
import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { IoChevronDown } from "react-icons/io5";
import { logout } from "../actions/userActions";
import HeaderMenuItem from "./HeaderMenuItem";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [show, setShow] = useState(false);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Flex
      as="header"
      alignItems="center"
      justifyContent="space-between"
      wrap="wrap"
      zIndex="99999"
      py="6"
      px="6"
      bgColor="black"
      w="100%"
      pos="fixed"
      top="0"
      left="0"
    >
      {/* logo */}
      <Link as={RouterLink} to="/">
        <Heading
          as="h1"
          color="whiteAlpha.800"
          fontWeight="bold"
          fontSize="1.8rem"
          letterSpacing="wide"
          fontFamily="Arial Black"
        >
          RST STORE
        </Heading>
      </Link>

      {/* Hamburger Menu */}
      <Box
        display={{ base: "block", md: "none" }}
        onClick={() => setShow(!show)}
      >
        <Icon as={HiOutlineMenuAlt3} color="white" w="6" h="6" />
      </Box>

      {/* menu */}
      <Box
        display={{ base: show ? "block" : "none", md: "flex" }}
        width={{ base: "full", md: "auto" }}
        mt={{ base: 4, md: 0 }}
      >
        <HeaderMenuItem icon={HiShoppingBag} label="Cart" url="/cart" />

        {userInfo ? (
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button
                rightIcon={<IoChevronDown />}
                _hover={{ textDecor: "none", opacity: "0.7" }}
              >
                {userInfo.name}
              </Button>
            </Menu.Trigger>

            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item value="profile" asChild>
                    <RouterLink to="/profile">Profile</RouterLink>
                  </Menu.Item>

                  <Menu.Item value="logout" onSelect={logoutHandler}>
                    Logout
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        ) : (
          <HeaderMenuItem icon={HiUser} label="Login" url="/login" />
        )}

        {/* Admin Menu */}
        {userInfo && userInfo.isAdmin && (
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button
                ml="3"
                fontWeight="semibold"
                rightIcon={<IoChevronDown />}
                _hover={{ textDecor: "none", opacity: "0.7" }}
              >
                Manage
              </Button>
            </Menu.Trigger>

            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item value="users" asChild>
                    <RouterLink to="/admin/userlist">All Users</RouterLink>
                  </Menu.Item>

                  <Menu.Item value="products" asChild>
                    <RouterLink to="/admin/productlist">
                      All Products
                    </RouterLink>
                  </Menu.Item>

                  <Menu.Item value="orders" asChild>
                    <RouterLink to="/admin/orderlist">All Orders</RouterLink>
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        )}
      </Box>
    </Flex>
  );
};

export default Header;
