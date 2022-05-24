import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const constants = {
  development: {
    rafflableUrl: 'http://localhost:3000',
    explorerUrl: 'https://explorer-dev.kardiachain.io/address',
    web3RpcEndpoint: 'https://dev-1.kardiachain.io',
    factories: ['0x4Cf8aB283AE6038413492FcCc7F86C182c7bAAa6'],
    dashboardRefreshInterval: 5000,
  },
  testnet: {
    rafflableUrl: 'https://testnet.rafflable.io',
    explorerUrl: 'https://explorer-dev.kardiachain.io/address',
    web3RpcEndpoint: 'https://dev-1.kardiachain.io',
    factories: ['0x4Cf8aB283AE6038413492FcCc7F86C182c7bAAa6'],
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
