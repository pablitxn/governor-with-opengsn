import { networks } from './networks';
import { GSNConfig, GsnEvent, RelayProvider } from '@opengsn/provider';
import { ethers, EventFilter, Signer, ContractTransaction } from 'ethers';
import CounterArtifact from '../abis/src/contracts/Counter.sol/Counter.json';
import { Web3ProviderBaseInterface } from '@opengsn/common/dist/types/Aliases';

class CounterContract implements ICounterContract {
  theContract: ethers.Contract;
  ethersProvider: ethers.providers.Provider;
  blockDates: { [key: number]: Date };
  gsnProvider: RelayProvider;

  constructor(address: string, signer: Signer, gsnProvider: RelayProvider) {
    this.theContract = new ethers.Contract(address, CounterArtifact.abi, signer);
    this.ethersProvider = signer.provider!;
    this.gsnProvider = gsnProvider;
    this.blockDates = {};
  }

  async onIncrement(step: number): Promise<ContractTransaction> {
    return await this.theContract.increment(step);
  }

  async onDecrement(step: number): Promise<ContractTransaction> {
    return await this.theContract.decrement(step);
  }

  async getEventInfo(e: ethers.Event): Promise<EventInfo> {
    if (!e.args) {
      return {
        previousHolder: 'notevent',
        currentHolder: JSON.stringify(e),
      };
    }
    return {
      date: await this.getBlockDate(e.blockNumber),
      previousHolder: e.args.previousHolder,
      currentHolder: e.args.currentHolder,
    };
  }

  listenToEvents(onEvent: (e: EventInfo) => void, onProgress?: (e: GsnEvent) => void) {
    // @ts-ignore
    const listener = async (from, to, event) => {
      const info = await this.getEventInfo(event);
      onEvent(info);
    };

    this.theContract.on('Increment', listener);
    this.theContract.on('Decrement', listener);
    if (onProgress != undefined) {
      this.gsnProvider.registerEventListener(onProgress);
    }
  }

  stopListenToEvents(onEvent?: EventFilter, onProgress = null) {
    this.theContract.off(onEvent as any, null as any);
    this.gsnProvider.unregisterEventListener(onProgress as any);
  }

  async getBlockDate(blockNumber: number) {
    if (!this.blockDates[blockNumber]) {
      this.blockDates[blockNumber] = new Date(
        await this.ethersProvider.getBlock(blockNumber).then((b) => {
          return b.timestamp * 1000;
        }),
      );
    }
    return this.blockDates[blockNumber];
  }

  async getPastEvents(count = 5) {
    const currentBlock = (await this.ethersProvider.getBlockNumber()) - 1;
    const network = await this.ethersProvider.getNetwork();
    const lookupWindow = networks[network.chainId].pastEventsQueryMaxPageSize || (30 * 24 * 3600) / 12;;
    const startBlock = Math.max(1, currentBlock - lookupWindow);

    const logs = await this.theContract.queryFilter(
      this.theContract.filters.Increment(),
      startBlock,
    );
    const lastLogs = await Promise.all(logs.slice(-count).map((e) => this.getEventInfo(e)));
    return lastLogs;
  }

  async getSigner(): Promise<string> {
    const signer = await this.theContract.signer.getAddress();
    return signer;
  }

  async getGsnStatus(): Promise<GsnStatusInfo> {
    const relayClient = this.gsnProvider.relayClient;
    const ci = relayClient.dependencies.contractInteractor as any;

    return {
      relayHubAddress: ci.relayHubInstance.address,
      forwarderAddress: ci.forwarderInstance.address,
      paymasterAddress: ci.paymasterInstance.address,

      getPaymasterBalance: () => ci.paymasterInstance.getRelayHubDeposit(),
      getActiveRelayers: async () =>
        relayClient.dependencies.knownRelaysManager
          .refresh()
          .then(() => relayClient.dependencies.knownRelaysManager.allRelayers.length),
    };
  }

  async getCurrentValue() {
    const currentValue = await this.theContract.value();
    const value = currentValue.toNumber();
    return value;
  }
}

const initCounter = async (chainId: number, connection: Web3ProviderBaseInterface): Promise<CounterContract> => {
  const { paymasterAddress, counterAddress } = networks[chainId];

  const gsnConfig: Partial<GSNConfig> = {
    paymasterAddress,
    loggerConfiguration: {
      logLevel: 'debug',
    },
  };

  const gsnProvider = RelayProvider.newProvider({
    provider: connection,
    config: gsnConfig,
  });

  await gsnProvider.init();
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(gsnProvider);
  const signer = provider.getSigner();

  const counterContract = new CounterContract(counterAddress, signer, gsnProvider);

  return counterContract;
};

export { initCounter, CounterContract };
