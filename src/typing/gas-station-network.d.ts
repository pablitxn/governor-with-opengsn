interface EventInfo {
  date?: Date;
  previousHolder: string;
  currentHolder: string;
}

interface GsnStatusInfo {
  getActiveRelayers: () => Promise<number>;
  getPaymasterBalance: () => Promise<string>;
  relayHubAddress: string;
  paymasterAddress: string;
  forwarderAddress: string;
}
