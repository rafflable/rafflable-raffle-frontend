import { DialogContextProvider } from '@/contexts/DialogContext';
import { KardiachainContextProvider } from '@/contexts/KardiachainContext';
import { RaffleConfigContextProvider } from '@/contexts/RaffleConfigContext';
import '../styles/global.scss';

function MyApp({ Component, pageProps }) {
  return (
    <DialogContextProvider>
      <RaffleConfigContextProvider>
        <KardiachainContextProvider>
          <Component {...pageProps} />;
        </KardiachainContextProvider>
      </RaffleConfigContextProvider>
    </DialogContextProvider>
  );
}

export default MyApp;
