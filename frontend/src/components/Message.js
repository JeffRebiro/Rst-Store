import { Alert } from "@chakra-ui/react";

const Message = ({ type = "info", children }) => {
  return (
    <Alert status={type}>
      {children}
    </Alert>
  );
};

export default Message;