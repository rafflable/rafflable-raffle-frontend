import { callHelpers, sendTransaction } from '@/utils/callHelpers';
import KardiaClient from 'kardia-js-sdk';
import raffler from '@/abi/Raffler.json';
import constants from '@/constants';

const client = new KardiaClient({ endpoint: constants.web3RpcEndpoint });

const readRaffler = (address, method, params = []) => {
  client.contract.updateAbi(raffler.abi);
  return callHelpers(client.contract, address, method, params);
};

const claim = async (address, account, ticket) => {
  const txData = client.contract.invokeContract('withdraw', [ticket]).txData()

  const response = await sendTransaction(client, account, txData, address)

  return response.transactionHash
}


const useRaffler = () => {
  return { readRaffler, claim };
};

export default useRaffler;
