// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import hre from 'hardhat';
import { ethers } from 'hardhat';

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // Contracts from logs of gns
  // const RelayHub = await ethers.getContractFactory('RelayHub');
  // const StakeManager = await ethers.getContractFactory('StakeManager');
  // const Penalizer = await ethers.getContractFactory('Penalizer');
  // const Forwarder = await ethers.getContractFactory('Forwarder');
  // const Paymaster = await ethers.getContractFactory('BasePaymaster');
  // const VersionRegistry = await ethers.getContractFactory('VersionRegistry');
  // const TestPaymasterEverythingAccepted = await ethers.getContractFactory(
  //   'TestPaymasterEverythingAccepted',
  // );

  const SingleRecipientPaymaster = await ethers.getContractFactory("SingleRecipientPaymaster");

  // Found Paymaster
  // Found Relayer
  // Found Stake Manager

  const Counter = await ethers.getContractFactory('Counter');
  const counterContract = await Counter.deploy(0);
  await counterContract.deployed();
  console.log('Counter app deployed to:', counterContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
