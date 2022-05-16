import type { NextPage } from 'next';
import { Flex, Heading } from '@chakra-ui/react';
import WalletConnector from 'components/wallet-connector';
import Counter from 'components/counter';

const Home: NextPage = () => {
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
      <Counter />
    </Flex>
  );
};

export default Home;
