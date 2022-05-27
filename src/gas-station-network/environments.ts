/**
 * Maximum unstake delay is defined at around 3 years for the mainnet.
 * This is done to prevent mistakenly setting an unstake delay to millions of years.
 */
const defaultStakeManagerMaxUnstakeDelay: number = 100000000;

const defaultPenalizerConfiguration: PenalizerConfiguration = {
  penalizeBlockDelay: 5,
  penalizeBlockExpiration: 60000,
};

const defaultRelayHubConfiguration: RelayHubConfiguration = {
  gasOverhead: 57090,
  postOverhead: 17104,
  gasReserve: 100000,
  maxWorkerCount: 10,
  minimumUnstakeDelay: 15000,
  devAddress: '0xb95Dbde8F8BB5d807Da6cDB8Ba8A2C7106068B12', // rinkeby address
  devFee: 0,
};

const preRelayedCallGasLimit = 1e5;
const forwarderHubOverhead = 5e4;
const defaultPaymasterConfiguration: PaymasterConfiguration = {
  forwarderHubOverhead: forwarderHubOverhead,
  preRelayedCallGasLimit: preRelayedCallGasLimit,
  postRelayedCallGasLimit: 11e4,
  acceptanceBudget: preRelayedCallGasLimit + forwarderHubOverhead,
  calldataSizeLimit: 10404,
};

const ganacheLocal: Environment = {
  dataOnChainHandlingGasCostPerByte: 13,
  chainId: 1337,
  relayHubConfiguration: defaultRelayHubConfiguration,
  penalizerConfiguration: defaultPenalizerConfiguration,
  paymasterConfiguration: defaultPaymasterConfiguration,
  maxUnstakeDelay: defaultStakeManagerMaxUnstakeDelay,
  abandonmentDelay: 1000,
  escheatmentDelay: 500,
  mintxgascost: 21000,
  gtxdatanonzero: 16,
  gtxdatazero: 4,
  getGasPriceFactor: 1,
  nonZeroDevFeeGasOverhead: 5596,
};

const rinkebyTestnet: Environment = {
  dataOnChainHandlingGasCostPerByte: 13,
  chainId: 1337,
  relayHubConfiguration: defaultRelayHubConfiguration,
  penalizerConfiguration: defaultPenalizerConfiguration,
  paymasterConfiguration: defaultPaymasterConfiguration,
  maxUnstakeDelay: defaultStakeManagerMaxUnstakeDelay,
  abandonmentDelay: 1000,
  escheatmentDelay: 500,
  mintxgascost: 21000,
  gtxdatanonzero: 16,
  gtxdatazero: 4,
  getGasPriceFactor: 1,
  nonZeroDevFeeGasOverhead: 5596,
};

export enum EnvironmentsKeys {
  ganacheLocal = 'ganacheLocal',
  rinkebyTestnet = 'rinkebyTestnet',
}

export const environments: { [key in EnvironmentsKeys]: Environment } = {
  ganacheLocal,
  rinkebyTestnet,
};

export function getEnvironment(
  chainId: number,
): { name: EnvironmentsKeys; environment: Environment } | undefined {
  const name = Object.keys(environments).find(
    (env) => environments[env as EnvironmentsKeys].chainId === chainId,
  ) as EnvironmentsKeys;
  if (name == null) {
    return undefined;
  }
  const environment = environments[name];
  return { name, environment };
}

export const defaultEnvironment = environments.ganacheLocal;
