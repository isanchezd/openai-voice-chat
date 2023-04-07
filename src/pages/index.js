import Head from 'next/head';
import { useState } from 'react';
import { IconMessage, IconMicrophone } from '@/components/Icons';
import { Textarea, Heading, Flex, Box, Text, Button } from '@chakra-ui/react';


export default function Home() {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);

  const onChangeMessage = (event) => {
    const newText = event.target.value;
    setText(newText);
  };

  const onKeyDownMessage = async (event) => {
    const keyCode = event.keyCode;
    const newText = event.target.value;
    const ENTER_KEY = 13;

    if (keyCode === ENTER_KEY) {
      setText('');
      updateMessages(newText);
      const message = await getChatMessage(newText);
      updateMessages(message);
    }
  };

  const onSpeechButtonClick = async () => {
    const spoken = (await import('../../node_modules/spoken/build/spoken'))
      .default;

    const transcript = await spoken.listen();

    updateMessages(transcript);
    const message = await getChatMessage(transcript);
    updateMessages(message);
    spoken.say(message);
  };

  const updateMessages = (newMessage) => {
    setMessages((previousMessages) => {
      return [newMessage, ...previousMessages];
    });
  };

  return (
    <>
      <Head>
        <title>OpenAI Voice Chat</title>
        <meta name='description' content='GPT Voice Assistant' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <Flex bg='gray.700' color='white' h='100vh' direction='column'>
          <Box w='100%' p={4} borderBottomColor='white' borderBottomWidth="1px">
            <Heading>OpenAI Voice Chat</Heading>
          </Box>
          <Box flexGrow={2}>
            <MessagesList messages={messages}></MessagesList>
          </Box>
          <Box>
            <Textarea
              name='message'
              id='message'
              value={text}
              onKeyDown={onKeyDownMessage}
              onChange={onChangeMessage}
            ></Textarea>
            <Button bg='grey.500'
              onClick={onSpeechButtonClick}
            >
              <IconMicrophone></IconMicrophone>
            </Button>
          </Box>
        </Flex>
      </main>
    </>
  );
}

function MessagesList({ messages }) {
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

async function getChatMessage(message) {
  const requestConfig = {
    method: 'Post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  };

  try {
    const response = await fetch('/api', requestConfig);

    const data = await response.json();
    const newMessage = data.text;

    if (response.status !== 200) {
      throw (
        data.error || new Error(`Request failed with status ${response.status}`)
      );
    }

    return newMessage;
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}
