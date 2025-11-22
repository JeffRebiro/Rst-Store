import { Flex, Text } from "@chakra-ui/react";

const Rating = ({ value, text, color = "red.500" }) => {
  return (
    <Flex align="center" gap="1">
      <Text color={color} fontSize="lg">
        {'★'.repeat(Math.floor(value))}
        {'☆'.repeat(5 - Math.floor(value))}
      </Text>
      {text && <Text fontSize="sm">{text}</Text>}
    </Flex>
  );
};

export default Rating;