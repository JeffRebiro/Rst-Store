import { Alert } from "@chakra-ui/react"

const Message = ({ type = "info", children }) => {
  return (
    <Alert.Root status={type}>
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>{children}</Alert.Title>
      </Alert.Content>
    </Alert.Root>
  )
}

export default Message