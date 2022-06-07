import Web3 from 'web3';
import { useRouter } from 'next/router';
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import KardiaClient from 'kardia-js-sdk';
import useRaffleFactory from '@/hooks/useRaffleFactory';
import useRafflerFactory from '@/hooks/useRafflerFactory';
import useRafflableFactory from '@/hooks/useRafflableFactory';
import useRaffler from '@/hooks/useRaffler';
import useRafflable from '@/hooks/useRafflable';
import useKRC20 from '@/hooks/useKRC20';
import constants from '@/constants';

const RaffleConfigContext = React.createContext();
const client = new KardiaClient({ endpoint: constants.web3RpcEndpoint });

const RaffleConfigContextProvider = ({ children }) => {
  const [loadingStatus, setLoadingStatus] = useState('find our keys');
  const [raffleConfig, setRaffleConfig] = useState({});
  const router = useRouter();

  const { logsRaffleFactory } = useRaffleFactory();
  const { logsRafflerFactory } = useRafflerFactory();
  const { logsRafflableFactory } = useRafflableFactory();
  const { readRafflable } = useRafflable();
  const { readRaffler } = useRaffler();
  const { readKRC20 } = useKRC20();

  const l = (msg) => setLoadingStatus(msg)

  const getInitialValues = async (config, raffler, rafflable) => {
    const values = {};
    l('grab a hat')
    values.hat = await readRaffler(raffler, 'hat');
    l('start the car');
    values.prizeBalance = await readRaffler(raffler, 'prizeOf', [config.tokenAddress]);
    values.prizeTarget = await readRaffler(raffler, 'rafflePrize', [config.tokenAddress]);
    l('get you there')
    values.title = await readRafflable(rafflable, 'name');
    values.ticketCost = await readRafflable(rafflable, 'cost');
    values.ticketCap = await readRafflable(rafflable, 'cap');
    values.ticketSupply = await readRafflable(rafflable, 'totalSupply');
    values.drawCounter = await readRaffler(raffler, 'counter');
    return values;
  };

  const fetchConfig = useCallback(async () => {
    let txInput = `0x${router.query['tx']}`;
    const isValidTx = /^0x([A-Fa-f0-9]{64})$/.test(txInput);
    if (!isValidTx) {
      if (router.isReady) {
        setRaffleConfig(undefined);
      }
      return;
    }
    const tx = await client.transaction.getTransaction(txInput)
    if (!constants.factories.includes(tx.to)) {
      setRaffleConfig(undefined);
      return;
    }
    try {
      const logs = await logsRafflerFactory(txInput);
      const publishedEvent = logs.find((o) => { return o.event && o.event.name === "RafflerCreated" })
      if (!publishedEvent) {
        setRaffleConfig(undefined);
        return;
      }
      const raffler = publishedEvent.event.raffler;

      logs = await logsRafflableFactory(txInput);
      publishedEvent = logs.find((o) => { return o.event && o.event.name === "RafflableCreated" })
      if (!publishedEvent) {
        setRaffleConfig(undefined);
        return;
      }
      const rafflable = publishedEvent.event.rafflable;

      logs = await logsRaffleFactory(txInput);
      publishedEvent = logs.find((o) => { return o.event && o.event.name === "RafflePublished" })
      if (!publishedEvent) {
        setRaffleConfig(undefined);
        return;
      }
      const creator = publishedEvent.event.creator;

      const uri = await readRafflable(rafflable, 'configUri');
      const config = await fetch(uri).then((res) => res.json());
      l('put on boots')
      config.title = publishedEvent.event.title;
      config.creator = Web3.utils.toChecksumAddress(creator);
      config.tokenAddress = await readRafflable(rafflable, 'token');
      config.tokenSymbol = await readKRC20(config.tokenAddress, 'symbol');
      config.tokenDecimals = await readKRC20(config.tokenAddress, 'decimals');
      const values = await getInitialValues(config, raffler, rafflable);

      setRaffleConfig({
        loaded: true,
        block: tx.blockNumber,
        createdAt: tx.time,
        rafflableAddress: rafflable,
        rafflerAddress: raffler,
        config: config,
        initialValues: values,
      });
    } catch (error) {
      setRaffleConfig(undefined);
    }
  }, [router]);

  useEffect(() => {
    if (router.isReady) {
      fetchConfig();
    }
  }, [router.isReady]);

  return (
    <RaffleConfigContext.Provider value={{raffleConfig, loadingStatus}}>
      {children}
    </RaffleConfigContext.Provider>
  );
};

RaffleConfigContextProvider.propTypes = {
  children: PropTypes.node,
};

export { RaffleConfigContext, RaffleConfigContextProvider };
