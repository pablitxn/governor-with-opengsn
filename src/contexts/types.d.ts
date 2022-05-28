type IGlobalContext = {
  provider: ethers.providers.Web3Provider;
  signer: ethers.providers.JsonRpcSigner;
  connection: ethers.providers.Web3Provider;
  network: ethers.providers.Network;
  account: string;
  ethers?: any;
  chainId: number;
  governorContract: IGovernorContract;
} | null;

