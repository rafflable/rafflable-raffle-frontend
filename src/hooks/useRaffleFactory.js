import KardiaClient from 'kardia-js-sdk';
import factory from '@/abi/RaffleFactory.json';
import constants from '@/constants';

const client = new KardiaClient({ endpoint: constants.web3RpcEndpoint });
client.contract.updateAbi(factory.abi);

const logsRaffleFactory = (tx) => {
  return client.contract.parseEvent(tx);
}

const useRaffleFactory = () => {
  return { logsRaffleFactory };
};

export default useRaffleFactory;
