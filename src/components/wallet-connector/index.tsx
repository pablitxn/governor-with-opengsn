import { FC } from 'react';
import { Text, Flex } from '@chakra-ui/react';

const WalletConnector: FC = () => (
  <Flex alignSelf="flex-end">
    <Text border="1px" p={2} as="span" mb={4} color="green.400">
      Conectado
    </Text>
  </Flex>
);

export default WalletConnector;
