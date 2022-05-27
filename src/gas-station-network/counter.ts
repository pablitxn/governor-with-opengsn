import { networks } from './networks';
import { GSNConfig, GsnEvent, RelayProvider } from '@opengsn/provider';
import { ethers, EventFilter, Signer } from 'ethers';
import CounterArtifact from '../abis/src/contracts/Counter.sol/Counter.json';

declare let window: { ethereum: any; location: any };
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
    let listener = async (from, to, event) => {
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
    let relayClient = gsnProvider.relayClient;
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

  return {
    onIncrement,
    onDecrement,
    listenToEvents,
    stopListenToEvents,
    getPastEvents,
    getSigner,
    getGsnStatus,
    address: theContract.address,
  };
};

const initCounter = async () => {
  const web3Provider = window.ethereum;
  if (!web3Provider) throw new Error('No "window.ethereum" found. do you have Metamask installed?');

  web3Provider.on('chainChanged', (chainId: number) => {
    console.log('chainChanged', chainId);
    window.location.reload();
  });
  web3Provider.on('accountsChanged', (accs: any[]) => {
    console.log('accountChanged', accs);
    window.location.reload();
  });

  const provider = new ethers.providers.Web3Provider(web3Provider);
  const network = await provider.getNetwork();
  const chainId = network.chainId;
  const net = (global.network = networks[chainId]);
  const netid: any = await provider.send('net_version', []);

  console.log('chainid=', chainId, 'networkid=', netid);

  const gsnConfig: Partial<GSNConfig> = {
    paymasterAddress: net.paymaster,
    loggerConfiguration: {
      logLevel: 'debug',
    },
  };

  const gsnProvider = RelayProvider.newProvider({
    provider: web3Provider,
    config: gsnConfig,
  });

  await gsnProvider.init();
  // @ts-ignore
  const provider2 = new ethers.providers.Web3Provider(gsnProvider);
  const signer = provider2.getSigner();

  return CounterContractHanlder(net.counter, signer, gsnProvider);
};

export { initCounter };
