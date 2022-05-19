import Web3 from 'web3';
import React from 'react';
import getConfig from 'next/config';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  Progress,
} from 'reactstrap';
import { NotificationDialog } from '@/ui/dialogs';

import useRaffleConfig from '@/hooks/useRaffleConfig';
import useKardiachain from '@/hooks/useKardiachain';
import useKRC20 from '@/hooks/useKRC20';
import constants from '@/constants';

// icons
import { MdNotificationsNone, MdPowerSettingsNew, MdMenu, MdAccountBalanceWallet } from 'react-icons/md';

const BigNumber = require('bignumber.js');

const DropdownWallet = () => {
  const [balance, setBalance] = React.useState(0);
  const [symbol, setSymbol] = React.useState(0);
  const { account, onLogout, library } = useKardiachain();
  const { raffleConfig } = useRaffleConfig();
  const { readKRC20 } = useKRC20();

  const web3 = new Web3(library);
  const { publicRuntimeConfig } = getConfig();

  const withDecimals = (val) => {
    if (val) {
      return new BigNumber(val).shiftedBy(-Math.abs(raffleConfig.config.tokenDecimals)).toString();
    }
  }

  const truncate = (address) => {
    const v = address.match(/^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/);
    if (!v) return address;
    return `${v[1]}...${v[2]}`;
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (raffleConfig && raffleConfig.loaded) {
        setSymbol(raffleConfig.config.tokenSymbol);
        readKRC20(raffleConfig.config.tokenAddress, 'balanceOf', [account]).then((balance) => {
          setBalance(balance);
        });
      }
    }, constants.dashboardRefreshInterval);
    return () => clearInterval(interval);
  }, [account]);

  return (
    <UncontrolledDropdown>
      <DropdownToggle tag="div">
        <Button block color="primary" size="22" className="text-uppercase">
          <MdAccountBalanceWallet size="22" />
          &emsp;{truncate(account)}
        </Button>
      </DropdownToggle>
      <DropdownMenu right style={{ minWidth: '20rem' }}>
        <DropdownItem header>Balance</DropdownItem>
        <DropdownItem divider />
        <DropdownItem className="d-flex justify-content-between align-items-center">
          <img src={`${publicRuntimeConfig.assetPrefix}/raff-token-logo.png`} />
          {withDecimals(balance)}&emsp;{symbol}
        </DropdownItem>
        <DropdownItem divider />
        <div className="text-right ml-3 mr-3 mt-2">
          <Button
            block
            color="success"
            size="sm"
            onClick={() => {
              onLogout();
            }}>
            <MdPowerSettingsNew size="15" />
            &emsp;Disconnect
          </Button>
        </div>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

const ConnectWallet = () => {
  const { onConnect, isKardiachainInstalled } = useKardiachain();

  if (!isKardiachainInstalled) {
    return (
      <NotificationDialog
        title="Could not connect with Kardiachain Wallet"
        notification="You may be viewing this site without the browser extension installed or outside your Kardiachain Wallet app.">
        <Button block color="primary" size="22" className="text-uppercase">
          <MdAccountBalanceWallet size="22" />
          &emsp;Connect wallet
        </Button>
      </NotificationDialog>
    );
  }

  return (
    <Button
      block
      color="primary"
      size="22"
      className="text-uppercase"
      onClick={() => {
        onConnect();
      }}>
      <MdAccountBalanceWallet size="22" />
      &emsp;Connect wallet
    </Button>
  );
};

const Header = (props) => {
  const { account } = useKardiachain();

  return (
    <header className="site-head d-flex align-items-center justify-content-between">
      <div className="wrap mr-4">
        <MdMenu size="24" color="#fff" onClick={props.toggleNav} style={{ cursor: 'pointer' }} />
      </div>
      <div className="right-elems ml-auto d-flex">
        <div className="wrap notify hidden-sm-down">
          <UncontrolledDropdown>
            <DropdownToggle tag="div">
              <MdNotificationsNone size="22" color="#fff" />
            </DropdownToggle>

            <DropdownMenu right style={{ minWidth: '18rem' }}>
              <DropdownItem header>No new notification</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>

        <div className="wrap profile">{account ? <DropdownWallet /> : <ConnectWallet />}</div>
      </div>
    </header>
  );
};

export default Header;
