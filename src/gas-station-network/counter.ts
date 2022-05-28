import { networks } from './networks';
import { GSNConfig, GsnEvent, RelayProvider } from '@opengsn/provider';
import { ethers, EventFilter, Signer } from 'ethers';
import CounterArtifact from '../abis/src/contracts/Counter.sol/Counter.json';

declare let global: { network: any };

const CounterContractHanlder = (address: string, signer: Signer, gsnProvider: RelayProvider) => {
  const blockDates: { [key: number]: Date } = {};
  const ethersProvider = signer.provider!;
  const theContract = new ethers.Contract(address, CounterArtifact.abi, signer);

  const onIncrement = async (step: number): Promise<void> => {
    return await theContract.increment(step);
  };

  const onDecrement = async (step: number): Promise<void> => {
    return await theContract.decrement(step);
  };

  const getEventInfo = async (e: ethers.Event): Promise<EventInfo> => {
    if (!e.args) {
      return {
        previousHolder: 'notevent',
        currentHolder: JSON.stringify(e),
      };
    }
    return {
      date: await getBlockDate(e.blockNumber),
      previousHolder: e.args.previousHolder,
      currentHolder: e.args.currentHolder,
    };
  };

  const listenToEvents = (onEvent: (e: EventInfo) => void, onProgress?: (e: GsnEvent) => void) => {
    // @ts-ignore
    const listener = async (from, to, event) => {
      const info = await getEventInfo(event);
      onEvent(info);
    };

    theContract.on('Increment', listener);
    theContract.on('Decrement', listener);
    if (onProgress != undefined) {
      gsnProvider.registerEventListener(onProgress);
    }
  };

  const stopListenToEvents = (onEvent?: EventFilter, onProgress = null) => {
    theContract.off(onEvent as any, null as any);
    gsnProvider.unregisterEventListener(onProgress as any);
  };

  const getBlockDate = async (blockNumber: number) => {
    if (!blockDates[blockNumber]) {
      blockDates[blockNumber] = new Date(
        await ethersProvider.getBlock(blockNumber).then((b) => {
          return b.timestamp * 1000;
        }),
      );
    }
    return blockDates[blockNumber];
  };

  const getPastEvents = async (count = 5) => {
    const currentBlock = (await ethersProvider.getBlockNumber()) - 1;
    const lookupWindow = global.network?.pastEventsQueryMaxPageSize || (30 * 24 * 3600) / 12;
    const startBlock = Math.max(1, currentBlock - lookupWindow);

    const logs = await theContract.queryFilter(theContract.filters.Increment(), startBlock);
    const lastLogs = await Promise.all(logs.slice(-count).map((e) => getEventInfo(e)));
    return lastLogs;
  };

  const getSigner = () => theContract.signer.getAddress();

  const getGsnStatus = async (): Promise<GsnStatusInfo> => {
    const relayClient = gsnProvider.relayClient;
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
  };

  const getCurrentValue = async () => {
    const currentValue = await theContract.value();
    const value = currentValue.toNumber();
    return value;
  };

  return {
    onIncrement,
    onDecrement,
    listenToEvents,
    stopListenToEvents,
    getPastEvents,
    getSigner,
    getGsnStatus,
    getCurrentValue,
    address: theContract.address,
  };
};

const initCounter = async (ctx: any) => {
  const { chainId, connection } = ctx;
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

  return CounterContractHanlder(counterAddress, signer, gsnProvider);
};

export { initCounter };
