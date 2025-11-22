import { Box } from "@chakra-ui/react";

const Message = ({ type = "info", children }) => {
  const bgColor = type === "error" ? "red.100" : "blue.100";
  const borderColor = type === "error" ? "red.300" : "blue.300";
  const textColor = type === "error" ? "red.800" : "blue.800";

  return (
    <Box
      bg={bgColor}
      border="1px"
      borderColor={borderColor}
      color={textColor}
      px="4"
      py="3"
      borderRadius="md"
      mb="4"
    >
      {children}
    </Box>
  );
};

export default Message;