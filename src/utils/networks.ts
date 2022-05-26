interface NetworkType {
  name: string;
  etherscan?: string;
  paymaster: string;
  counter: string;
  relayLookupWindowBlocks?: number;
  relayRegistrationLookupBlocks?: number;
  pastEventsQueryMaxPageSize?: number;
}

let localnetwork: NetworkType = {} as any;
try {
  // console.log('==reading localnet dir=', __dirname);
  localnetwork = {
    name: 'local',
    paymaster: '0xcf4Fff6DBDAeD3Db545b28cc8702020000B4DBf2',
    counter: require('../abis/src/contracts/Counter.sol/Counter.json').address,
  };
} catch (e) {
  console.warn('No local network:', (e as Error).message);
}

export const networks: { [chain: number]: NetworkType } = {
  4: {
    name: 'Rinkeby',
    etherscan: 'https://rinkeby.etherscan.io/address/',
    paymaster: '0xA6e10aA9B038c9Cddea24D2ae77eC3cE38a0c016',
    pastEventsQueryMaxPageSize: 2e4,
    relayLookupWindowBlocks: 1e5,
    relayRegistrationLookupBlocks: 1e5,
    counter: '0x562bCbCcDCD8a2784bB22016A2d86C8e6fB84156',
  },
  1337: localnetwork,
};
