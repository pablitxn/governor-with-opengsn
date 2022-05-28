import type { NextPage } from 'next';
import { Flex, HStack, Heading } from '@chakra-ui/react';
import WalletConnector from 'components/wallet-connector';
// import CreateProposal from 'components/create-proposal';
import ProposalList from 'components/proposal-list';
import GsnStatus from 'components/gsn-status';
// import GsnInfo from 'components/gsn-info';
import useGovernor from 'hooks/useGovernor';

const Home: NextPage = () => {
  const { castVote } = useGovernor();

  return (
    <Flex p="2rem 20rem" flexDir="column" justify="center">
      <HStack>
        {/* <GsnInfo /> */}
        <WalletConnector />
      </HStack>
      <Heading
        as="h2"
        fontSize="2.25rem"
        mb={8}
        fontWeight={400}
        alignSelf="center"
        color="green.500"
      >
        Governor using meta-tx with EIP 2771
      </Heading>
      {/* <CreateProposal onSubmit={() => {}} /> */}
      <ProposalList castVote={castVote} />
      <GsnStatus />
    </Flex>
  );
};

export default Home;
