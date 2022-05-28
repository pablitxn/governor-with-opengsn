import { FC, useState } from 'react';
import { Flex, Text, Input, Button, HStack, Select } from '@chakra-ui/react';

const ProposalList: FC<any> = ({ castVote }) => {
  const [state, setState] = useState({
    proposalId: '',
    support: '',
    reason: '',
  });
  const { proposalId, support, reason } = state;

  const handleVote = (e: any) => {
    castVote(proposalId, support, reason);
  };

  const handleChange = (e: any) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Flex direction="column" align="start" justify="center">
      <Text fontSize="2rem" fontWeight="bold" mb={4}>
        Vote some proposal
      </Text>

      <Flex direction="column" align="center" justify="center">
        <HStack direction="row" align="center" justify="center" gap={4} mb={4}>
          <Flex direction="column" align="center" justify="center" mr={4}>
            <Text fontSize="1.5rem" mb={2}>
              proposal id
            </Text>
            <Input
              type="text"
              name="proposalId"
              placeholder="insert proposal id"
              onChange={handleChange}
              value={proposalId}
            />
          </Flex>
          <Flex direction="column" align="center" justify="center" mr={4}>
            <Text fontSize="1.5rem" mb={2}>
              vote
            </Text>
            <Select w="10rem">
              <option value="0">Against</option>
              <option value="1">For</option>
              <option value="2">Abstain</option>
            </Select>
          </Flex>
          <Flex direction="column" align="center" justify="center" mr={4}>
            <Text fontSize="1.5rem" mb={2}>
              reason
            </Text>
            <Input
              type="text"
              name="reason"
              placeholder="insert reason"
              onChange={handleChange}
              value={reason}
            />
          </Flex>
          <Button colorScheme="green" onClick={handleVote}>
            Vote
          </Button>
        </HStack>
      </Flex>
    </Flex>
  );
};

export default ProposalList;
