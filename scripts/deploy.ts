import { ethers } from 'hardhat';

async function main() {
  const rinkebyForwarder = '0x83A54884bE4657706785D7309cf46B58FE5f6e8a';

  const Counter = await ethers.getContractFactory('Counter');
  const counterContract = await Counter.deploy(rinkebyForwarder, 0);
  await counterContract.deployed();
  console.log('Counter app deployed to:', counterContract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
