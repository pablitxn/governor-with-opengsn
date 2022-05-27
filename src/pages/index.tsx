import type { NextPage } from 'next';
import { Flex, Heading } from '@chakra-ui/react';
import WalletConnector from 'components/wallet-connector';
import Counter from 'components/counter';
import useCounter from '../hooks/useCounter';

const Home: NextPage = () => {
  const { onIncrement, onDecrement, value } = useCounter();

  return (
    <Flex p="2rem 20rem" flexDir="column">
      <WalletConnector />
      <Heading
        as="h2"
        fontSize="2.25rem"
        mb={4}
        fontWeight={400}
        alignSelf="center"
        color="green.500"
      >
        meta-tx using EIP 2771
      </Heading>
      <Counter onIncrement={onIncrement} onDecrement={onDecrement} value={value} />
    </Flex>
  );
};

export default Home;
