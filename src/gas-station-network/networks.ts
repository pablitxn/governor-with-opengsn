interface NetworkType {
  name: string;
  etherscan?: string;
  paymasterAddress: string;
  counterAddress: string;
  relayLookupWindowBlocks?: number;
  relayRegistrationLookupBlocks?: number;
  pastEventsQueryMaxPageSize?: number;
}

let localnetwork: NetworkType = {} as any;
try {
  console.log('==reading localnet dir=', __dirname);
  localnetwork = {
    name: 'local',
    paymasterAddress: '0xcf4Fff6DBDAeD3Db545b28cc8702020000B4DBf2',
    // @ts-ignore
    counterAddress: require('../abis/src/contracts/Governor.sol/MyGovernor.json').address,
  };
} catch (e) {
  console.warn('No local network:', (e as Error).message);
}

export const networks: { [chain: number]: NetworkType } = {
  4: {
    name: 'Rinkeby',
    etherscan: 'https://rinkeby.etherscan.io/address/',
    paymasterAddress: '0xA6e10aA9B038c9Cddea24D2ae77eC3cE38a0c016',
    pastEventsQueryMaxPageSize: 2e4,
    relayLookupWindowBlocks: 1e5,
    relayRegistrationLookupBlocks: 1e5,
    counterAddress: '0x7B2D046f6D878B4Da5d9131Ff5B90a3962fBA6b1',
  },
  1337: localnetwork,
};
