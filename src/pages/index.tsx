import type { NextPage } from 'next';
import { Flex, HStack,Heading } from '@chakra-ui/react';
import WalletConnector from 'components/wallet-connector';
import Counter from 'components/counter';
// import GsnStatus from 'components/gsn-status';
// import GsnInfo from 'components/gsn-info';
import useCounter from 'hooks/useCounter';

const Home: NextPage = () => {
  const { onIncrement, onDecrement, value } = useCounter();

  return (
    <Flex p="2rem 20rem" flexDir="column">
      <HStack>
        {/* <GsnInfo /> */}
        <WalletConnector />
      </HStack>
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
      {/* <GsnStatus /> */}
    </Flex>
  );
};

export default Home;
