import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import RiseLoader from 'react-spinners/RiseLoader';
import useRaffleConfig from '@/hooks/useRaffleConfig';

export default function ConfigLoader(props) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const { raffleConfig, loadingStatus } = useRaffleConfig();
  const router = useRouter();
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
        <div className="d-flex flex-column justify-content-center align-items-center vh-100 col-lg-12">
          <h3>An error occured.  Please try again.</h3>
        </div>     
      </>
    );
  }
  if (loaded) {
    return props.children;
  }

  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 col-lg-12">
        <RiseLoader loading={true} css="display: block; margin-bottom: 4em;" />
        <h3>Please wait while we...</h3>
        <h2 className="">
          {loadingStatus}
        </h2>
      </div>
      <div style={{ display: 'none' }}>{props.children}</div>
    </>
  );
}
