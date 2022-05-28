import hre from "hardhat"
import { ethers } from "hardhat"

async function main() {
  const forwarder = '0x83A54884bE4657706785D7309cf46B58FE5f6e8a'

  // We get the contract to deploy
  const Token = await ethers.getContractFactory("GovernanceToken")
  const tokenContract = await Token.deploy()
  await tokenContract.deployed()
  console.log("Token deployed to:", tokenContract.address)

  const Governor = await ethers.getContractFactory("MyGovernor")
  const governorContract = await Governor.deploy(tokenContract.address, forwarder)
  await governorContract.deployed()

  console.log("Governor deployed to:", governorContract.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
