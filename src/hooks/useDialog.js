import { useContext } from 'react';
import { DialogContext } from '@/contexts/DialogContext';
const useDialog = () => useContext(DialogContext);
export default useDialog;
