import React from 'react';
import PropTypes from 'prop-types';

const DialogContext = React.createContext();

const DialogContextProvider = ({ children }) => {
  const [isBuyDialogOpen, setBuyDialogOpen] = React.useState(false);
  const [isClaimDialogOpen, setClaimDialogOpen] = React.useState(false);

  return (
    <DialogContext.Provider value={{
      isBuyDialogOpen,
      setBuyDialogOpen,
      isClaimDialogOpen,
      setClaimDialogOpen
    }}>
      {children}
    </DialogContext.Provider>
  );
};

DialogContextProvider.propTypes = {
  children: PropTypes.node,
};

export { DialogContext, DialogContextProvider };
