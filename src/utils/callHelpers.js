import constants from '@/constants';

export const callHelpers = (contract, address, method, params = []) => {
  const invoke = contract.invokeContract(method, params);
  return invoke.call(address, {}, 'latest');
};

export const estimatedHelpers = (contract, method, params = []) => {
  const invoke = contract.invokeContract(method, params);
  return invoke.estimateGas(invoke.txData());
};

export const txDataHelpers = (contract, methodName, params = []) => {
  return contract.invokeContract(methodName, params).txData();
};

export const sendTransaction = async (client, account, txData, toAddress, params = {}) => {
  const kardiaTransaction = client.transaction;

  const res = await kardiaTransaction.sendTransactionToExtension(
    {
      from: account,
      data: txData,
      waitUntilMined: true,
      to: toAddress,
      ...params,
    },
    true,
  )

  if (res.status === 0) throw new Error('Transaction Failed!')

  return res
}

