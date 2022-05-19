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

const mint = async (rafflableAddress, account, amount) => {
  const txData = client.contract.invokeContract('mint', [amount]).txData()

  const response = await sendTransaction(client, account, txData, rafflableAddress)

  return response.transactionHash
}

const useRafflable = () => {
  return { logsRafflable, readRafflable, mint };
};

export default useRafflable;
