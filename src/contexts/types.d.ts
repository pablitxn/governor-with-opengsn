type IGlobalContext = {
  provider: ethers.providers.Web3Provider;
  signer: ethers.providers.JsonRpcSigner;
  marketContract: ethers.Contract;
  account: string;
  marketplaceAddress: string;
  ethers?: any;
} | null;
