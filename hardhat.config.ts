// eslint-disable-next-line import/no-extraneous-dependencies
import 'solidity-coverage';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'hardhat-deploy';
import { config as envConfig } from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';

envConfig({ path: '.env.local' });

const rinkebyUrl = process.env.RINKEBY_URL || 'https://rinkeby.infura.io/v3/your-api-key';
const accountPrivateKey = process.env.ACCOUNT_PRIVATE_KEY || 'privateKey';
const etherscanApiKey = process.env.ETHERSCAN_API_KEY || 'your-api-key';

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  solidity: {
    compilers: [
      {
        version: '0.8.6',
        settings: {
          optimizer: { enabled: true, runs: 200 },
        },
      },
      {
        version: '0.8.1',
        settings: {
          optimizer: { enabled: true, runs: 200 },
        },
      },
    ],
  },
  networks: {
    hardhat: {},
    rinkeby: {
      url: rinkebyUrl,
      accounts: [accountPrivateKey],
    },
    ganache: {
      url: 'http://127.0.0.1:7545',
      chainId: 1337,
      accounts: [accountPrivateKey],
    },
  },
  paths: {
    sources: './src/contracts',
    tests: './test',
    cache: './cache',
    artifacts: './src/abis',
  },
  mocha: {
    timeout: 20000,
  },
  etherscan: { apiKey: etherscanApiKey },
};

export default config;
