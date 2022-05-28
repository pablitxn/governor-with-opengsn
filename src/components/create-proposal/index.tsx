import { FC } from 'react';
import { Heading, HStack, VStack, Button, Input } from '@chakra-ui/react';

const CreateProposal: FC<any> = ({ onSubmit }) => (
  <VStack>
    <Heading as="h3" mb={4} color="green.400" fontSize="2rem">
      Create Proposal:
    </Heading>
    <HStack>
      <Input />
      <Button
        onClick={onSubmit}
        variant="solid"
        colorScheme="orange"
        bg="orange.900"
        fontSize="1rem"
        size="sm"
        p={4}
      >
        create!
      </Button>
    </HStack>
  </VStack>
);

export default CreateProposal;
