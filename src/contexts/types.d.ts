type IGlobalContext = {
  provider: ethers.providers.Web3Provider;
  signer: ethers.providers.JsonRpcSigner;
  account: string;
  ethers?: any;
} | null;
