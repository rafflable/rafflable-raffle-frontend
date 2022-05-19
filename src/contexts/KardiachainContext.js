import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import PropTypes from 'prop-types';

const KardiachainContext = React.createContext({
  isKardiachainInstalled: false,
  library: undefined,
});

const connectorLocalStorageKey = 'active';

// This context maintain 2 counters that can be used as a dependencies on other hooks to force a periodic refresh
const KardiachainContextProvider = ({ children }) => {
  const [isKardiachainInstalled, setIsKardiachainInstalled] = useState(false);
  const [library, setLibrary] = useState(undefined);
  const [account, setAccount] = useState(undefined);

  const handleConnect = async () => {
    await window.kardiachain.enable();
    const web3 = new Web3(window.kardiachain);
    const [accounts] = await web3.eth.getAccounts();
    const accountsChecksum = web3.utils.toChecksumAddress(accounts);
    setAccount(accountsChecksum);
    window.localStorage.setItem(connectorLocalStorageKey, accountsChecksum);
  };

  const handleLogout = () => {
    window.localStorage.removeItem(connectorLocalStorageKey);
    setAccount(undefined);
  };

  useEffect(() => {
    if (window.kardiachain) {
      setLibrary(window.kardiachain);
      if (window.kardiachain.isKaiWallet) {
        setIsKardiachainInstalled(true);
        const connLocal = window.localStorage.getItem(connectorLocalStorageKey);
        if (connLocal) {
          handleConnect();
        }
        return;
      }
    }
    setIsKardiachainInstalled(false);
  }, []);

  useEffect(() => {
    if (window.kardiachain) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          if (account && accounts[0] !== account) {
            const web3 = new Web3(window.kardiachain);
            const accountsChecksum = web3.utils.toChecksumAddress(accounts[0]);
            setAccount(accountsChecksum);
            window.localStorage.setItem(connectorLocalStorageKey, accountsChecksum);
          }
        }
        return null;
      };

      window.kardiachain.on('accountsChanged', handleAccountsChanged);

      return () => {
        if (window.kardiachain.removeListener) {
          window.kardiachain.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, [account]);

  return (
    <KardiachainContext.Provider
      value={{
        isKardiachainInstalled,
        library,
        account,
        onConnect: handleConnect,
        onLogout: handleLogout,
      }}>
      {children}
    </KardiachainContext.Provider>
  );
};

KardiachainContextProvider.propTypes = {
  children: PropTypes.node,
};

export { KardiachainContext, KardiachainContextProvider };
