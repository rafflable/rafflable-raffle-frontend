import KardiaClient from 'kardia-js-sdk';
import { callHelpers, sendTransaction } from '@/utils/callHelpers';
import traff from '@/abi/TRAFF.json';
import constants from '@/constants';

const client = new KardiaClient({ endpoint: constants.web3RpcEndpoint });

const faucet = async (tokenAddress, account) => {
  client.contract.updateAbi(traff.abi);
  const txData = client.contract.invokeContract('faucet', []).txData()
  const response = await sendTransaction(client, account, txData, tokenAddress)
  return response.transactionHash
}

const useTRAFF = () => {
  return { faucet };
};

export default useTRAFF;
