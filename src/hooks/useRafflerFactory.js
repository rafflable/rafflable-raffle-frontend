import KardiaClient from 'kardia-js-sdk';
import factory from '@/abi/RafflerFactory.json';
import constants from '@/constants';

const client = new KardiaClient({ endpoint: constants.web3RpcEndpoint });
client.contract.updateAbi(factory.abi);

const logsRafflerFactory = (tx) => {
  return client.contract.parseEvent(tx);
}

const useRafflerFactory = () => {
  return { logsRafflerFactory };
};

export default useRafflerFactory;
