interface DeploymentConfiguration {
  readonly registrationMaxAge: number;
  readonly minimumStakePerToken: { [key: string]: string };
  readonly paymasterDeposit: string;
  readonly deployTestPaymaster: boolean;
  readonly isArbitrum?: boolean;
}

interface Environment {
  readonly chainId: number;
  readonly mintxgascost: number;
  readonly relayHubConfiguration: RelayHubConfiguration;
  readonly penalizerConfiguration: PenalizerConfiguration;
  readonly paymasterConfiguration: PaymasterConfiguration;
  readonly deploymentConfiguration?: DeploymentConfiguration;
  readonly maxUnstakeDelay: number;
  readonly abandonmentDelay: number;
  readonly escheatmentDelay: number;
  readonly gtxdatanonzero: number;
  readonly gtxdatazero: number;
  readonly dataOnChainHandlingGasCostPerByte: number;
  readonly getGasPriceFactor: number;
  readonly nonZeroDevFeeGasOverhead: number;
}
