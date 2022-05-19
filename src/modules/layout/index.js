import React from 'react';
import Head from 'next/head';

import Nav from '../nav';
import SiteHead from '../header';
import ConfigLoader from '../loader';

export default function Layout(props) {
  const [navMini, setNavMini] = React.useState(false);

  const toggleNav = (e) => {
    e.preventDefault();
    setNavMini((n) => !n);
  };

  const hideNav = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setNavMini(false);
  };

  return (
    <ConfigLoader>
      <div className="app-wrapper">
        <Head>
          <meta name="description" content="" />
          <title>Rafflable</title>
        </Head>
        <Nav mini={navMini} toggleNav={toggleNav} />
        <div className={`content-container ${navMini ? 'full' : ''}`}>
          {/* dropshadow for mobile nav triggering */}
          <div
            className="menu-dropshadow"
            style={{ display: navMini ? 'block' : 'none' }}
            onClick={hideNav}></div>
          <SiteHead toggleNav={toggleNav} />
          <div className="view">{props.children}</div>
        </div>
      </div>
    </ConfigLoader>
  );
}
