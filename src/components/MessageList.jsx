import { Box, Text } from '@chakra-ui/react';

export function MessagesList({ messages }) {
  return (
    <Box padding={'4'}>
      {messages.reverse().map((message, index) => (
        <Message key={index} message={message}></Message>
      ))}
    </Box>
  );
}

function Message({ message }) {
  return (
    <Box marginTop={4}>
      <Text>{message}</Text>
    </Box>
  );
}
