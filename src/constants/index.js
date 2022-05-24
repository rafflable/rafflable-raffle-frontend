import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const constants = {
  development: {
    rafflableUrl: 'http://localhost:3000',
    explorerUrl: 'https://explorer-dev.kardiachain.io/address',
    web3RpcEndpoint: 'https://dev-1.kardiachain.io',
    factories: ['0xf113072010C5fA33d78Ce306ed67C606b6152e74'],
    dashboardRefreshInterval: 5000,
  },
  testnet: {
    rafflableUrl: 'https://testnet.rafflable.io',
    explorerUrl: 'https://explorer-dev.kardiachain.io/address',
    web3RpcEndpoint: 'https://dev-1.kardiachain.io',
    factories: ['0xf113072010C5fA33d78Ce306ed67C606b6152e74'],
    dashboardRefreshInterval: 5000,
  },
  production: {
    rafflableUrl: 'https://rafflable.io',
    explorerUrl: 'https://explorer.kardiachain.io/address',
    web3RpcEndpoint: 'https://rpc.kardiachain.io',
    factories: [],
    dashboardRefreshInterval: 5000,
  },
}[publicRuntimeConfig.env];

export default constants;
