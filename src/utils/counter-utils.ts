import { networks } from '../utils/networks';
import { GSNConfig, GsnEvent, RelayProvider } from '@opengsn/provider';
import { ethers, EventFilter, Signer, providers } from 'ethers';
import CounterArtifact from '../abis/src/contracts/Counter.sol/Counter.json';

declare let window: { ethereum: any; location: any };
declare let global: { network: any };

export interface EventInfo {
  date?: Date;
  previousHolder: string;
  currentHolder: string;
}

export interface GsnStatusInfo {
  getActiveRelayers: () => Promise<number>;
  getPaymasterBalance: () => Promise<string>;
  relayHubAddress: string;
  paymasterAddress: string;
  forwarderAddress: string;
}

const counterHandler = (address: string, signer: Signer, gsnProvider: RelayProvider) => {
  const blockDates: { [key: number]: Date } = {};
  const ethersProvider = signer.provider!;
  const theContract = new ethers.Contract(address, CounterArtifact.abi, signer);

  const onIncrement = async (step: number): Promise<void> => {
    return await theContract.increment(step);
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
    //look at most one month back (in 12-second block)
    const lookupWindow = global.network?.pastEventsQueryMaxPageSize || (30 * 24 * 3600) / 12;
    const startBlock = Math.max(1, currentBlock - lookupWindow);

    const logs = await theContract.queryFilter(theContract.filters.Increment(), startBlock);
    const lastLogs = await Promise.all(logs.slice(-count).map((e) => getEventInfo(e)));
    return lastLogs;
  };

  const getSigner = () => {
    return theContract.signer.getAddress();
  };

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

  console.log(gsnProvider)

  return {
    onIncrement,
    listenToEvents,
    stopListenToEvents,
    getPastEvents,
    getSigner,
    getGsnStatus,
  };
};

const initCounter = async () => {
  let web3Provider: any;
  if (typeof window !== 'undefined') {
    web3Provider = window.ethereum;
  }

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

  // console.log('chainid=', chainId, 'networkid=', netid);
  if (chainId !== parseInt(netid))
    console.warn(
      `Incompatible network-id ${netid} and ${chainId}: for Metamask to work, they should be the same`,
    );
  if (!net || !net.paymaster) {
    //ganache/hardnat network
    if (!chainId.toString().match(/1337/) || !window.location.href.match(/localhost|127.0.0.1/))
      throw new Error(
        `Unsupported network (chainId=${chainId}) . please switch to one of: ` +
          Object.values(networks)
            .map((n: any) => n.name)
            .filter((n) => n)
            .join(' / '),
      );
    else
      throw new Error(
        'To run locally, you must run "yarn evm" and then "yarn deploy" before "yarn react-start" ',
      );
  }

  //on kotti (at least) using blockGasLimit breaks our code..
  const maxViewableGasLimit = chainId === 6 ? 5e6 : undefined;

  const gsnConfig: Partial<GSNConfig> = {
    maxViewableGasLimit,
    relayLookupWindowBlocks: global.network.relayLookupWindowBlocks || 600000,
    relayRegistrationLookupBlocks: global.network.relayRegistrationLookupBlocks || 600000,
    loggerConfiguration: { logLevel: 'debug' },
    pastEventsQueryMaxPageSize:
      global.network.pastEventsQueryMaxPageSize || Number.MAX_SAFE_INTEGER,
    paymasterAddress: net.paymaster,
  };

  // console.log('== gsnconfig=', gsnConfig);

  const gsnProvider = RelayProvider.newProvider({
    provider: web3Provider,
    config: gsnConfig,
  });

  await gsnProvider.init();
  const provider2 = new ethers.providers.Web3Provider(
    gsnProvider as any as providers.ExternalProvider,
  );

  const signer = provider2.getSigner();

  return counterHandler(net.counter, signer, gsnProvider);
};

export { counterHandler, initCounter };
