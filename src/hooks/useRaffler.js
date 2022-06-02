import { callHelpers, sendTransaction } from '@/utils/callHelpers';
import KardiaClient from 'kardia-js-sdk';
import raffler from '@/abi/Raffler.json';
import constants from '@/constants';

const client = new KardiaClient({ endpoint: constants.web3RpcEndpoint });
client.contract.updateAbi(raffler.abi);

const logsRaffler = async (address, fromBlock, topics = []) => {
  const logs = await client.kaiChain.getLogs(fromBlock, 'latest', address, topics);
  return logs ? logs.map((item) => client.contract.parseEventFromLog(item)) : [];
};

const readRaffler = (address, method, params = []) => {
  return callHelpers(client.contract, address, method, params);
};

const claim = async (address, account, ticket) => {
  const txData = client.contract.invokeContract('withdraw', [ticket]).txData()

  const response = await sendTransaction(client, account, txData, address)

  return response.transactionHash
}


const useRaffler = () => {
  return { readRaffler, logsRaffler, claim };
};

export default useRaffler;
