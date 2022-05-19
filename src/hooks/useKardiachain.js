import { useContext } from 'react';
import { KardiachainContext } from '../contexts/KardiachainContext';

const useKardiachain = () => {
  const { isKardiachainInstalled, library, account, onConnect, onLogout } =
    useContext(KardiachainContext);

  return { library, isKardiachainInstalled, account, onConnect, onLogout };
};

export default useKardiachain;
