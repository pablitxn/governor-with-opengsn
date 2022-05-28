import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { initGovernor } from 'gas-station-network/governor';

const useDapp = () => {
  const [dappState, setDappState] = useState<IGlobalContext>(null);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        if (!connection)
          throw new Error('No "window.ethereum" found. do you have Metamask installed?');

        const provider = new ethers.providers.Web3Provider(connection);
        const network = await provider.getNetwork();
        const signer = provider.getSigner();
        const account = await signer.getAddress();
        const chainId = network.chainId;

        connection.on('chainChanged', (chainId: number) => {
          console.log('chainChanged', chainId);
          window.location.reload();
        });
        connection.on('accountsChanged', (accs: any[]) => {
          console.log('accountChanged', accs);
          window.location.reload();
        });

        const governorContract = await initGovernor(chainId, connection);

        setDappState({
          provider,
          signer,
          account,
          ethers,
          connection,
          network,
          chainId,
          governorContract,
        });
      } catch (err) {
        setError(err);
      }
    })();
  }, []);

  return { dappState, error };
};

export default useDapp;
