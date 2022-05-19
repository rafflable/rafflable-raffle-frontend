import { callHelpers } from '../utils/callHelpers';
import KardiaClient from 'kardia-js-sdk';
import raffler from '../abi/Raffler.json';
import constants from '@/constants';

const client = new KardiaClient({ endpoint: constants.web3RpcEndpoint });

const readRaffler = (address, method, params = []) => {
  client.contract.updateAbi(raffler.abi);
  return callHelpers(client.contract, address, method, params);
};

const useRaffler = () => {
  return { readRaffler };
};

export default useRaffler;
