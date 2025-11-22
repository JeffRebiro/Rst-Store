import { Text } from "@chakra-ui/react";

const Rating = ({ value, text, color = "red.500" }) => {
  return (
    <Text color={color}>
      Rating: {value} {text && `- ${text}`}
    </Text>
  );
};

export default Rating;