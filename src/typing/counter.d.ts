interface CounterState {
  currentValue?: number;
  events?: any[];
  status?: string;
}

interface ICounterContract {
  theContract: ethers.Contract;
  ethersProvider: ethers.providers.Provider;
  blockDates: { [key: number]: Date };
  gsnProvider: RelayProvider;

  onIncrement: (step: number) => Promise<ethers.ContractTransaction>;
  onDecrement: (step: number) => Promise<ethers.ContractTransaction>;
  getEventInfo: (e: ethers.Event) => Promise<EventInfo>;
  listenToEvents: (onEvent: (e: EventInfo) => void, onProgress?: (e: GsnEvent) => void) => void;
  stopListenToEvents: (onEvent?: EventFilter, onProgress = null) => void;
  getBlockDate: (blockNumber: number) => Promise<Date>;
  getPastEvents: (count?: number) => Promise<ethers.Event[]>;
  getSigner: () => Promise<string>;
  getGsnStatus: () => Promise<GsnStatusInfo>;
  getCurrentValue: () => Promise<number>;
}
