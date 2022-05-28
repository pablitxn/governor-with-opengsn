interface CounterState {
  currentValue?: number;
  events?: any[];
  status?: string;
}

interface IGovernorContract {
  theContract: ethers.Contract;
  ethersProvider: ethers.providers.Provider;
  blockDates: { [key: number]: Date };
  gsnProvider: RelayProvider;

  castVoteWithReason: (proposalId: string, support: number, reason: string) => Promise<ethers.ContractTransaction>;
  propose: (
    targets: string[],
    values: number[],
    calldatas: any,
    description: string,
  ) => Promise<ethers.ContractTransaction>;
  getEventInfo: (e: ethers.Event) => Promise<EventInfo>;
  listenToEvents: (onEvent: (e: EventInfo) => void, onProgress?: (e: GsnEvent) => void) => void;
  stopListenToEvents: (onEvent?: EventFilter, onProgress = null) => void;
  getBlockDate: (blockNumber: number) => Promise<Date>;
  getPastEvents: (count?: number) => Promise<ethers.Event[]>;
  getGsnStatus: () => Promise<GsnStatusInfo>;
}
