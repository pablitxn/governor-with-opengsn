import { FC, useContext } from 'react';
import { Flex } from '@chakra-ui/react';
import useGsnStatus from 'hooks/useGsnStatus';
import { GlobalContext } from 'contexts/global';
import { networks } from 'gas-station-network/networks';

export function Address({ addr, network }: any) {
  const href = `${networks[network.chainId].etherscan}/${addr}` || '#';
  return (
    <a href={href} target="etherscan">
      <span style={{ fontFamily: 'monospace' }}>
        {('' + addr)?.replace(/^(.{6}).*(.{4})$/, `$1...$2`) || '...'}
      </span>
    </a>
  );
}

const GsnStatus: FC<IGsnStatus> = () => {
  const ctx = useContext(GlobalContext);
  const { relayHubAddress, totalRelayers, paymasterAddress, forwarderAddress, paymasterBalance } =
    useGsnStatus();

  return (
    <Flex mt="1rem" borderColor="#8C8383" borderRadius="lg">
      <div>
        <div>
          <b>GSN Contracts Status:</b>
          <br />
          Current network: {ctx?.network.name}
          <br />
          GSN version: v2.2.x
          <br />
          RelayHub <Address addr={relayHubAddress} network={ctx?.network} />{' '}
          {totalRelayers && <>relayers: {totalRelayers}</>}
          <br />
          Paymaster <Address addr={paymasterAddress} network={ctx?.network} /> balance:{' '}
          {paymasterBalance} <br />
          Forwarder <Address addr={forwarderAddress} network={ctx?.network} />
          <br />
        </div>
      </div>
    </Flex>
  );
};

export default GsnStatus;
