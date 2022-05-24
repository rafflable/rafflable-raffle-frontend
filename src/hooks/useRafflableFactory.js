import KardiaClient from 'kardia-js-sdk';
import factory from '@/abi/RafflableFactory.json';
import constants from '@/constants';

const client = new KardiaClient({ endpoint: constants.web3RpcEndpoint });
client.contract.updateAbi(factory.abi);

const logsRafflableFactory = (tx) => {
  return client.contract.parseEvent(tx);
}

const useRafflableFactory = () => {
  return { logsRafflableFactory };
};

export default useRafflableFactory;
