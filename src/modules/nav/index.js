import React from 'react';
import getConfig from 'next/config';
import { Button, Collapse } from 'reactstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';
import constants from '@/constants';

import useDialog from '@/hooks/useDialog';
import useRaffleConfig from '@/hooks/useRaffleConfig';
import useTRAFF from '@/hooks/useTRAFF';
import useKardiachain from '@/hooks/useKardiachain';

// icons
import { GoGear } from 'react-icons/go';
import { FaDollarSign, FaShoppingCart, FaTicketAlt, FaGift } from 'react-icons/fa';
import { MdLayers, MdChevronRight } from 'react-icons/md';
import ScrollArea from '../scrollbar';

const NavHead = (props) => {
  const { publicRuntimeConfig } = getConfig();
  return (
    <header className="nav-head">
      <a href={constants.rafflableUrl}>
        <img src={`${publicRuntimeConfig.assetPrefix}/logo-nav.png`} />
      </a>
    </header>
  );
};

export default function Nav(props) {
  const router = useRouter();
  const { basePath, pathname } = router;

  const [rafflerContractUrl, setRafflerContractUrl] = React.useState('#');
  const [rafflableContractUrl, setRafflableContractUrl] = React.useState('#');
  const [collapseBasePath, setCollapseBasePath] = React.useState(''); // set Collapse path.
  const { setBuyDialogOpen, setClaimDialogOpen } = useDialog();
  const { raffleConfig } = useRaffleConfig();
  const { account } = useKardiachain();

  const { publicRuntimeConfig } = getConfig();
  const env = publicRuntimeConfig.env;

  React.useEffect(() => {
    // this must be base path of collapse and must be unique for each nested nav.
    const paths = ['contracts', 'marketplaces'];
    paths.forEach((p) => {
      const withBasePath = `${basePath}/${p}`;
      if (pathname.startsWith(withBasePath)) setCollapseBasePath(withBasePath);
    });
  }, [basePath, pathname]);

  React.useEffect(() => {
    if (raffleConfig && raffleConfig.loaded) {
      setRafflerContractUrl(`${constants.explorerUrl}/${raffleConfig.rafflerAddress}`);
      setRafflableContractUrl(`${constants.explorerUrl}/${raffleConfig.rafflableAddress}`);
    }
  }, [raffleConfig]);

  const toggleCollapse = (p, e) => {
    setCollapseBasePath((bp) => (bp === p ? '' : p));
  };

  return (
    <nav className={`site-nav ${props.mini ? 'mini' : ''}`}>
      <NavHead {...props} />
      <ScrollArea
        className="nav-list-container"
        horizontal={false}
        verticalScrollbarStyle={{ width: '4px', marginLeft: '10px' }}>
        <ul className="list-unstyled nav-list clearfix">
          <li>
            <div className="nav-list-title">Raffle</div>
          </li>
          <li>
            <a onClick={() => { setBuyDialogOpen(true) }}>
              <FaTicketAlt size="18" color="#10b981" />
              <span className="name">Buy tickets</span>
            </a>
          </li>

          <li>
            <a onClick={() => { setClaimDialogOpen(true) }}>
              <FaGift size="18" color="#047857" />
              <span className="name">Claim prize</span>
            </a>
          </li>

          <li>
            <div className="nav-list-title">Resources</div>
          </li>

          <li>
            <a href={constants.rafflableUrl}>
              <GoGear size="18" />
              <span className="name">How it works</span>
            </a>
          </li>

          <li
            onClick={(e) => toggleCollapse(`${basePath}/contracts`, e)}
            className={collapseBasePath === `${basePath}/contracts` ? 'selected' : ''}>
            <span className="submenu">
              <MdLayers size="18" />
              <span className="name">Contracts</span>
              <MdChevronRight size="14" className="icon-down" />
            </span>
            <Collapse isOpen={collapseBasePath === `${basePath}/contracts`}>
              <ul className="inner-drop list-unstyled">
                <li>
                  <a href={rafflableContractUrl} target="_blank">
                    Rafflable
                  </a>
                </li>
                <li>
                  <a href={rafflerContractUrl} target="_blank">
                    Raffler
                  </a>
                </li>
              </ul>
            </Collapse>
          </li>

          <li
            onClick={(e) => toggleCollapse(`${basePath}/marketplaces`, e)}
            className={collapseBasePath === `${basePath}/marketplaces` ? 'selected' : ''}>
            <span className="submenu">
              <FaShoppingCart size="18" />
              <span className="name">Marketplaces</span>
              <MdChevronRight size="14" className="icon-down" />
            </span>
            <Collapse isOpen={collapseBasePath === `${basePath}/marketplaces`}>
              <ul className="inner-drop list-unstyled">
                <li>
                  <a>Kephi Gallery</a>
                </li>
                <li>
                  <a>Becoswap</a>
                </li>
                <li>
                  <a>Agoran</a>
                </li>
              </ul>
            </Collapse>
          </li>

          {env !== "production" ?
          <>
          <li>
            <div className="nav-list-title">Testnet-only</div>
          </li>

          <li className="text-center p-2">
            <Button color="primary" className="w-100"
              onClick={() => {
                const { faucet } = useTRAFF();
                faucet(raffleConfig.config.tokenAddress, account).then((tx) => {
                }).catch((err) => {});
                
              }}
            disabled={!account}>
              <FaDollarSign size="18" />&nbsp;
              Get {raffleConfig && raffleConfig.config ? raffleConfig.config.tokenSymbol : ''}
            </Button>
          </li>
          </>
          : ''}

        </ul>
      </ScrollArea>
    </nav>
  );
}
