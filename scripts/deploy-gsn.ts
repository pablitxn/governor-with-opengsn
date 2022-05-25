import { DeployFunction, DeploymentsExtension } from 'hardhat-deploy/types'
import { HttpNetworkConfig } from 'hardhat/src/types/config'
import { Environment } from '../src/gas-station-network/environments'
import { registerForwarderForGsn } from '@opengsn/common/dist/EIP712/ForwarderUtil'
import { DeployOptions, DeployResult } from 'hardhat-deploy/dist/types'
import { formatEther, formatUnits, parseEther, parseUnits } from 'ethers/lib/utils'
import { ethers } from 'hardhat'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { fatal, getMergedEnvironment, getToken, printRelayInfo, setField } from '../src/gas-station-network/deployUtils'
import { Contract } from 'ethers'

const { AddressZero } = ethers.constants

// helper: nicer logging view fo deployed contracts
async function deploy (deployments: DeploymentsExtension, name: string, options: DeployOptions): Promise<DeployResult> {
  console.log('Deploying: ', name)
  const res = await deployments.deploy(name, options)
  console.log(name, res.address, res.newlyDeployed ? 'newlyDeployed' :'existing')
  return res
}

// check if token's minimum stake is correct. return null if no need to change.
async function updateTokenStakeOrNull (hub: Contract, tokenAddr: string, configMinimumStake: string): Promise<{ token: string, minimumStake: string } | null> {
  const token = await getToken(tokenAddr)
  const minStake = await hub.getMinimumStakePerToken(tokenAddr)
  const parsedConfigMinimumStake = parseUnits(configMinimumStake, token.decimals).toString()
  console.log(`- Staking Token "${token.symbol}" ${token.address} current ${formatUnits(minStake, token.decimals)} config ${configMinimumStake}`)
  if (parsedConfigMinimumStake !== minStake.toString()) {
    return { token: tokenAddr, minimumStake: parsedConfigMinimumStake }
  } else {
    return null
  }
}

// todo: debug any
export default async function deploymentFunc (this: DeployFunction, hre: HardhatRuntimeEnvironment): Promise<void> {
  // @ts-ignore
  const { web3, deployments, getChainId } = hre
  console.log('Connected to URL: ', (hre.network.config as HttpNetworkConfig).url)
  const accounts = await ethers.provider.listAccounts()
  const deployer = accounts[0]

  const balance = await ethers.provider.getBalance(deployer)
  console.log('deployer=', deployer, 'balance=', formatEther(balance.toString()))

  const chainId = parseInt(await getChainId())

  const env: Environment = getMergedEnvironment(chainId, deployer)

  console.log(env)

  if (env.deploymentConfiguration == null || Object.keys(env.deploymentConfiguration.minimumStakePerToken).length === 0) {
    fatal('must have at least one entry in minimumStakePerToken')
  }

  let stakingTokenAddress = Object.keys(env.deploymentConfiguration.minimumStakePerToken ?? {})[0]
  if (stakingTokenAddress == null) {
    fatal('must specify token address in minimumStakePerToken (or "test" to deploy WrappedEthToken')
  }

  if (stakingTokenAddress === 'test') {
    const WrappedEthToken = await deploy(deployments, 'WrappedEthToken', {
      from: deployer
    })
    stakingTokenAddress = WrappedEthToken.address
  }

  const deployedForwarder = await deploy(deployments, 'Forwarder', {
    from: deployer,
    deterministicDeployment: true
  })

  if (deployedForwarder.newlyDeployed) {
    const f = new web3.eth.Contract(deployedForwarder.abi, deployedForwarder.address)

    await registerForwarderForGsn(f, {
      from: deployer
    })
  }

  const penalizer = await deploy(deployments, 'Penalizer', {
    from: deployer,
    args: [
      env.penalizerConfiguration.penalizeBlockDelay,
      env.penalizerConfiguration.penalizeBlockDelay
    ]
  })

  const stakeManager = await deploy(deployments, 'StakeManager', {
    from: deployer,
    args: [env.maxUnstakeDelay, env.abandonmentDelay, env.escheatmentDelay, '0xa09321556e839d4BAd213e3F0F2649ad77e18fd0', env.relayHubConfiguration.devAddress]
  })

  const relayRegistrar = await deploy(deployments, 'RelayRegistrar', {
    from: deployer,
    args: [env.deploymentConfiguration.registrationMaxAge]
  })

  const hubConfig = env.relayHubConfiguration
  const hubContractName= 'RelayHub'
  const relayHub: DeployResult  = await deploy(deployments, hubContractName, {
    from: deployer,
    args: [
      stakeManager.address,
      penalizer.address,
      AddressZero, // batch gateway
      relayRegistrar.address,
      hubConfig
    ]
  })

  const hub = new ethers.Contract(relayHub.address, relayHub.abi, ethers.provider.getSigner())

  const configChanges = Object.entries(env.deploymentConfiguration.minimumStakePerToken).map(async ([tokenAddr, configMinimumStake]) =>
    await updateTokenStakeOrNull(hub, tokenAddr === 'test' ? stakingTokenAddress : tokenAddr, configMinimumStake))
    .filter(x => x != null)

  const tokens = await Promise.all(configChanges)

  if (tokens.length !== 0) {
    console.log('Adding/Updating token stakes', tokens)
    const ret = await hub.setMinimumStakes(tokens.map(x => x?.token), tokens.map(x => x?.minimumStake))
    await ret.wait()
  }

  let deployedPm: DeployResult
  if (env.deploymentConfiguration.deployTestPaymaster) {
    deployedPm = await deploy(deployments, 'TestPaymasterEverythingAccepted', { from: deployer, log: true })

    await setField(deployments, 'TestPaymasterEverythingAccepted', 'getRelayHub', 'setRelayHub', relayHub.address, deployer)
    await setField(deployments, 'TestPaymasterEverythingAccepted', 'getTrustedForwarder', 'setTrustedForwarder', deployedForwarder.address, deployer)

    const paymasterBalance = await deployments.read(hubContractName, 'balanceOf', deployedPm.address)
    console.log('current paymaster balance=', formatEther(paymasterBalance))
    const depositValue = parseEther(env.deploymentConfiguration.paymasterDeposit)

    if (paymasterBalance.toString() === '0') {
      console.log('depositing in paymaster', formatEther(depositValue))
      await deployments.execute(hubContractName, {
        from: deployer,
        value: depositValue,
        log: true
      }, 'depositFor', deployedPm.address)
    }
  }

  await printRelayInfo(hre)
}
