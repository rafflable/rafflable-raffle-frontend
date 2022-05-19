import { useContext } from 'react';
import { RaffleConfigContext } from '@/contexts/RaffleConfigContext';
const useRaffleConfig = () => useContext(RaffleConfigContext);
export default useRaffleConfig;
