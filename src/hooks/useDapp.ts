import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
// import Marketplace from 'abis/src/contracts/Marketplace.sol/Marketplace.json';
import { MARKETPLACE_ADDRESS } from 'utils/constants';

const useDapp = () => {
  const [dappState, setDappState] = useState<IGlobalContext>(null);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const account = await signer.getAddress();
        // const marketContract = new ethers.Contract(MARKETPLACE_ADDRESS, Marketplace.abi, signer);
        setDappState({
          provider,
          signer,
          marketContract: null,
          account,
          marketplaceAddress: MARKETPLACE_ADDRESS,
          ethers,
        });
      } catch (err) {
        setError(err);
      }
    })();
  }, []);

  return { dappState, error };
};

export default useDapp;
