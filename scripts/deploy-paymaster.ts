import { ethers } from 'hardhat';

async function main() {
  // AcceptEverythingPaymaster
  // const AcceptEverythingPaymaster = await ethers.getContractFactory('AcceptEverythingPaymaster');
  // const acceptEverythingPaymasterContract = await AcceptEverythingPaymaster.deploy();
  // await acceptEverythingPaymasterContract.deployed();
  // console.log(
  //   'AcceptEverythingPaymaster app deployed to:',
  //   acceptEverythingPaymasterContract.address,
  // );

  // WhitelistPaymaster
  const WhitelistPaymaster = await ethers.getContractFactory('WhitelistPaymaster');
  const whitelistPaymasterContract = await WhitelistPaymaster.deploy();
  await whitelistPaymasterContract.deployed();
  console.log('WhitelistPaymaster app deployed to:', whitelistPaymasterContract.address);

  // HashcashPaymaster
  // const HashcashPaymaster = await ethers.getContractFactory('HashcashPaymaster');
  // const hashcashPaymasterContract = await HashcashPaymaster.deploy();
  // await hashcashPaymasterContract.deployed();
  // console.log('HashcashPaymaster app deployed to:', hashcashPaymasterContract.address);

  // // TokenPaymaster
  // const TokenPaymaster = await ethers.getContractFactory('TokenPaymaster');
  // const tokenPaymasterContract = await TokenPaymaster.deploy();
  // await tokenPaymasterContract.deployed();
  // console.log('TokenPaymaster app deployed to:', tokenPaymasterContract.address);

  // // ProxyDeployingPaymaster
  // const ProxyDeployingPaymaster = await ethers.getContractFactory('ProxyDeployingPaymaster');
  // const proxyDeployingPaymasterContract = await ProxyDeployingPaymaster.deploy();
  // await proxyDeployingPaymasterContract.deployed();
  // console.log('ProxyDeployingPaymaster app deployed to:', proxyDeployingPaymasterContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
