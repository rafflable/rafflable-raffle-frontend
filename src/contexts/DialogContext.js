import React from 'react';
import PropTypes from 'prop-types';

const DialogContext = React.createContext();

const DialogContextProvider = ({ children }) => {
  const [isBuyDialogOpen, setBuyDialogOpen] = React.useState(false);
  const [isClaimDialogOpen, setClaimDialogOpen] = React.useState(false);
  const [isWithdrawDialogOpen, setWithdrawDialogOpen] = React.useState(false);
  const [isFaucetDialogOpen, setFaucetDialogOpen] = React.useState(false);
  const [isHistoryDialogOpen, setHistoryDialogOpen] = React.useState(false);

  return (
    <DialogContext.Provider value={{
      isHistoryDialogOpen,
      setHistoryDialogOpen,
      isBuyDialogOpen,
      setBuyDialogOpen,
      isClaimDialogOpen,
      setClaimDialogOpen,
      isWithdrawDialogOpen,
      setWithdrawDialogOpen,
      isFaucetDialogOpen,
      setFaucetDialogOpen
    }}>
      {children}
    </DialogContext.Provider>
  );
};

DialogContextProvider.propTypes = {
  children: PropTypes.node,
};

export { DialogContext, DialogContextProvider };
