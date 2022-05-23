import { useEffect, useState } from 'react';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import RotateLoader from 'react-spinners/RotateLoader';
import useRaffleConfig from '@/hooks/useRaffleConfig';

export default function ConfigLoader(props) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const { raffleConfig, loadingStatus } = useRaffleConfig();
  const router = useRouter();
  const { publicRuntimeConfig } = getConfig();
  useEffect(() => {
    if (raffleConfig === undefined) {
      setError(true);
    }
    if (raffleConfig && raffleConfig.loaded) {
      setLoaded(true);
    }
  }, [raffleConfig]);

  if (error) {
    return (
      <>
        <div className="loader d-flex flex-column justify-content-center align-items-center vh-100 col-lg-12">
          <img src={`${publicRuntimeConfig.assetPrefix}/logo-loader.png`} style={{ marginLeft: '-10px' }} />
          <h1
            style={{ marginTop: '-165px', paddingBottom: '100px', fontSize: '80px' }}
            className="font-weight-bold"
          >
            ?
          </h1>
          <h3>An error occured.</h3>
          <p className="w-100 text-center">Make sure you have a valid Rafflable transaction in the URL or you can try refreshing this page.</p>
        </div>     
      </>
    );
  }

  if (loaded) {
    return props.children;
  }

  return (
    <>
      <div className="loader d-flex flex-column justify-content-center align-items-center vh-100 col-lg-12">
        <RotateLoader color="#fff" size={20} loading={true}  />
        <img src={`${publicRuntimeConfig.assetPrefix}/logo-loader.png`} style={{ marginTop: '-105px', marginLeft: '-10px'  }} />
        <h3>Please wait while we...</h3>
        <h2 className="">
          {loadingStatus}
        </h2>
      </div>
      <div style={{ display: 'none' }}>{props.children}</div>
    </>
  );
}
