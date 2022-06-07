import KardiaClient from 'kardia-js-sdk';
import { callHelpers, sendTransaction } from '@/utils/callHelpers';
import rafflable from '@/abi/Rafflable.json';
import constants from '@/constants';

const client = new KardiaClient({ endpoint: constants.web3RpcEndpoint });
client.contract.updateAbi(rafflable.abi);

const logsRafflable = (tx) => {
  return client.contract.parseEvent(tx);
}

const readRafflable = (address, method, params = []) => {
  return callHelpers(client.contract, address, method, params);
};

const mint = async (address, account) => {
  const txData = client.contract.invokeContract('mint', []).txData()

  const response = await sendTransaction(client, account, txData, address)

  return response.transactionHash
}

const withdraw = async (address, account) => {
  const txData = client.contract.invokeContract('withdraw', []).txData()

  const response = await sendTransaction(client, account, txData, address)

  return response.transactionHash
}

const useRafflable = () => {
  return { logsRafflable, readRafflable, mint, withdraw };
};

export default useRafflable;
