import { FC } from 'react';
import { Heading, HStack, VStack, Button } from '@chakra-ui/react';

const Counter: FC<ICounter> = ({ onIncrement, onDecrement, value }) => (
  <VStack>
    <Heading as="h3" mb={4} color="green.400" fontSize="2rem">
      Counter: {value}
    </Heading>
    <HStack>
      <Button
        onClick={onDecrement}
        variant="solid"
        colorScheme="orange"
        bg="orange.900"
        fontSize="1rem"
        size="sm"
        p={4}
      >
        -1
      </Button>
      <Button
        onClick={onIncrement}
        variant="solid"
        colorScheme="orange"
        bg="orange.900"
        fontSize="1rem"
        size="sm"
        p={4}
      >
        +1
      </Button>
    </HStack>
  </VStack>
);

export default Counter;
