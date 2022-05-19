import KardiaClient from 'kardia-js-sdk';
import { callHelpers, sendTransaction } from '@/utils/callHelpers';
import krc20Abi from '@/abi/krc20.json';
import constants from '@/constants';

const client = new KardiaClient({ endpoint: constants.web3RpcEndpoint });

const readKRC20 = (address, method, params = []) => {
  client.contract.updateAbi(krc20Abi);
  return callHelpers(client.contract, address, method, params);
};

const approve = async (tokenAddress, rafflableAddress, account, amount) => {
  client.contract.updateAbi(krc20Abi);
  const txData = client.contract.invokeContract('approve', [rafflableAddress, amount]).txData()

  const response = await sendTransaction(client, account, txData, tokenAddress)

  return response.transactionHash
}

const useKRC20 = () => {
  return { readKRC20, approve };
};

export default useKRC20;
