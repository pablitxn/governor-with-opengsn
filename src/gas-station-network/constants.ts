import BN from 'bn.js'
import { toBN } from 'web3-utils'

// import paymasterAbi from '@opengsn/common/dist/interfaces/IPaymaster.json'
// import relayHubAbi from '@opengsn/common/dist/interfaces/IRelayHub.json'
// import forwarderAbi from '@opengsn/common/dist/interfaces/IForwarder.json'
// import stakeManagerAbi from '@opengsn/common/dist/interfaces/IStakeManager.json'
// import penalizerAbi from '@opengsn/common/dist/interfaces/IPenalizer.json'
// import relayRegistrarAbi from '@opengsn/common/dist/interfaces/IRelayRegistrar.json'
// import { getERC165InterfaceID } from '@opengsn/common/dist/Utils'

const dayInSec = 24 * 60 * 60
const weekInSec = dayInSec * 7
const yearInSec = dayInSec * 365
const oneEther = toBN(1e18)

export const constants = {
  dayInSec,
  weekInSec,
  yearInSec,
  oneEther,
  ZERO_ADDRESS: '0x0000000000000000000000000000000000000000',
  // OpenZeppelin's ERC-20 implementation bans transfer to zero address
  BURN_ADDRESS: '0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF',
  // in order to avoid error on insufficient balance for gas, send dry-run call from zero address
  DRY_RUN_ADDRESS: '0x0000000000000000000000000000000000000000',
  DRY_RUN_KEY: 'DRY-RUN',
  ZERO_BYTES32: '0x0000000000000000000000000000000000000000000000000000000000000000',
  MAX_UINT256: new BN('2').pow(new BN('256')).sub(new BN('1')),
  MAX_UINT96: new BN('2').pow(new BN('96')).sub(new BN('1')),
  MAX_INT256: new BN('2').pow(new BN('255')).sub(new BN('1')),
  MIN_INT256: new BN('2').pow(new BN('255')).mul(new BN('-1')),

  ARBITRUM_ARBSYS: '0x0000000000000000000000000000000000000064'
}

// export const erc165Interfaces = {
//   forwarder: getERC165InterfaceID(forwarderAbi as any),
//   paymaster: getERC165InterfaceID(paymasterAbi as any),
//   penalizer: getERC165InterfaceID(penalizerAbi as any),
//   // relayRegistrar: getERC165InterfaceID(relayRegistrarAbi as any),
//   relayHub: getERC165InterfaceID(relayHubAbi as any),
//   stakeManager: getERC165InterfaceID(stakeManagerAbi as any)
// }
