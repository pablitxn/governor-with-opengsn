import { ethers } from 'hardhat';

async function main() {
  // Stake Manager
  const StakeManager = await ethers.getContractFactory('StakeManager');
  const stakeManagerContract = await StakeManager.deploy(
    30000,
    0,
    0,
    '0x0000000000000000000000000000000000000001',
    '0x0000000000000000000000000000000000000001',
  );
  await stakeManagerContract.deployed();
  console.log('StakeManager deployed at: ', stakeManagerContract.address);

  // Penalizer
  const Penalizer = await ethers.getContractFactory('Penalizer');
  const penalizerContract = await Penalizer.deploy(0, 0);
  await penalizerContract.deployed();
  console.log('Penalizer deployed at: ', penalizerContract.address);

  // RelayHub
  const RelayHub = await ethers.getContractFactory('RelayHub');
  const relayHubContract = await RelayHub.deploy(
    stakeManagerContract.address,
    penalizerContract.address,
    '0x0000000000000000000000000000000000000000',
    '0x0000000000000000000000000000000000000000',
    {
      maxWorkerCount: 0,
      gasReserve: 0,
      postOverhead: 0,
      gasOverhead: 0,
      // maximumRecipientDeposit: 0,
      minimumUnstakeDelay: 0,
      devAddress: '0x0000000000000000000000000000000000000000',
      devFee: 0,
      // minimumStake: 0,
      // dataGasCostPerByte: 0,
      // externalCallDataCostOverhead: 0,
    },
  );
  await relayHubContract.deployed();
  console.log('RelayHub deployed at: ', relayHubContract.address);

  // Forwarder
  const Forwarder = await ethers.getContractFactory('Forwarder');
  const forwarderContract = await Forwarder.deploy();
  await forwarderContract.deployed();
  console.log('Forwarder deployed at', forwarderContract.address);

  // SingleRecipentPaymaster
  const SingleRecipientPaymaster = await ethers.getContractFactory('SingleRecipientPaymaster');
  const singleRecipientPaymasterContract = await SingleRecipientPaymaster.deploy(
    forwarderContract.address,
  );
  await singleRecipientPaymasterContract.deployed();
  console.log('SingleRecipientPaymaster deployed at', singleRecipientPaymasterContract.address);

  // APP -> Counter
  const Counter = await ethers.getContractFactory('Counter');
  const counterContract = await Counter.deploy(forwarderContract.address, 0);
  await counterContract.deployed();
  console.log('Counter app deployed to:', counterContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
