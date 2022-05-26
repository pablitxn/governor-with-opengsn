import { FC } from 'react';
import { Heading, HStack, VStack, Button } from '@chakra-ui/react';

const Counter: FC<{ onIncrement: any }> = ({ onIncrement }) => (
  <VStack>
    <Heading as="h3" mb={4} color="green.400" fontSize="2rem">
      Counter: 0
    </Heading>
    <HStack>
      <Button
        onClick={onIncrement}
        variant="solid"
        colorScheme="orange"
        bg="orange.900"
        fontSize="1rem"
        size="sm"
        p={4}
      >
        sum +1
      </Button>
      <Button variant="solid" colorScheme="orange" bg="orange.900" fontSize="1rem" size="sm" p={4}>
        sum +10
      </Button>
      <Button variant="solid" colorScheme="orange" bg="orange.900" fontSize="1rem" size="sm" p={4}>
        sub -1
      </Button>
      <Button variant="solid" colorScheme="orange" bg="orange.900" fontSize="1rem" size="sm" p={4}>
        sub -10
      </Button>
    </HStack>
  </VStack>
);

export default Counter;
