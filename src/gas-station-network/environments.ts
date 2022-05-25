import { RelayHubConfiguration } from '../typing/RelayHubConfiguration'
import { PaymasterConfiguration } from '../typing/PaymasterConfiguration'
import { PenalizerConfiguration } from '../typing/PenalizerConfiguration'

export interface DeploymentConfiguration {
  readonly registrationMaxAge: number
  readonly minimumStakePerToken: { [key: string]: string }
  readonly paymasterDeposit: string
  readonly deployTestPaymaster: boolean
  readonly isArbitrum?: boolean
}

export interface Environment {
  readonly chainId: number
  readonly mintxgascost: number
  readonly relayHubConfiguration: RelayHubConfiguration
  readonly penalizerConfiguration: PenalizerConfiguration
  readonly paymasterConfiguration: PaymasterConfiguration
  readonly deploymentConfiguration?: DeploymentConfiguration
  readonly maxUnstakeDelay: number
  readonly abandonmentDelay: number
  readonly escheatmentDelay: number
  readonly gtxdatanonzero: number
  readonly gtxdatazero: number
  readonly dataOnChainHandlingGasCostPerByte: number
  readonly getGasPriceFactor: number
  readonly nonZeroDevFeeGasOverhead: number
}

// deep (3-level) merge of environments
export function merge (env1: Environment, env2: Partial<Environment>): Environment {
  return Object.assign({}, env1, env2,
    {
      relayHubConfiguration: Object.assign({}, env1.relayHubConfiguration, env2.relayHubConfiguration),
      penalizerConfiguration: Object.assign({}, env1.penalizerConfiguration, env2.penalizerConfiguration),
      paymasterConfiguration: Object.assign({}, env1.paymasterConfiguration, env2.paymasterConfiguration),
      deploymentConfiguration: Object.assign({}, env1.deploymentConfiguration, env2.deploymentConfiguration, {
        minimumStakePerToken: Object.assign({}, env1.deploymentConfiguration?.minimumStakePerToken, env2.deploymentConfiguration?.minimumStakePerToken)
      })
    })
}

/**
 * Maximum unstake delay is defined at around 3 years for the mainnet.
 * This is done to prevent mistakenly setting an unstake delay to millions of years.
 */
const defaultStakeManagerMaxUnstakeDelay: number = 100000000

const defaultPenalizerConfiguration: PenalizerConfiguration = {
  penalizeBlockDelay: 5,
  penalizeBlockExpiration: 60000
}

const defaultRelayHubConfiguration: RelayHubConfiguration = {
  gasOverhead: 57090,
  postOverhead: 17104,
  gasReserve: 100000,
  maxWorkerCount: 10,
  minimumUnstakeDelay: 15000,
  // devAddress: '0xeFEfeFEfeFeFEFEFEfefeFeFefEfEfEfeFEFEFEf',
  devAddress: '0xb95Dbde8F8BB5d807Da6cDB8Ba8A2C7106068B12', // rinkeby address
  devFee: 0
}

// TODO add as constructor params to paymaster instead of constants
const preRelayedCallGasLimit = 1e5
const forwarderHubOverhead = 5e4
const defaultPaymasterConfiguration: PaymasterConfiguration = {
  forwarderHubOverhead: forwarderHubOverhead,
  preRelayedCallGasLimit: preRelayedCallGasLimit,
  postRelayedCallGasLimit: 11e4,
  acceptanceBudget: preRelayedCallGasLimit + forwarderHubOverhead,
  calldataSizeLimit: 10404
}

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
  nonZeroDevFeeGasOverhead: 5596
}

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
  nonZeroDevFeeGasOverhead: 5596
}

/* end Arbitrum-specific Environment */

export enum EnvironmentsKeys {
  ganacheLocal = 'ganacheLocal',
  rinkebyTestnet = 'rinkebyTestnet'
}

export const environments: { [key in EnvironmentsKeys]: Environment } = {
  ganacheLocal,
  rinkebyTestnet
}

export function getEnvironment (chainId: number): { name: EnvironmentsKeys, environment: Environment } | undefined {
  const name = Object.keys(environments).find(env => environments[env as EnvironmentsKeys].chainId === chainId) as EnvironmentsKeys
  if (name == null) {
    return undefined
  }
  const environment = environments[name]
  return { name, environment }
}

export const defaultEnvironment = environments.ganacheLocal
