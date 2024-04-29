"use client";

import React, { createContext } from "react";

type NavbarContextType = {
  identity: string;
  setIdentity: (identity: string) => void;
};

export const NavbarContext = createContext({} as NavbarContextType);

export const NavbarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [identity, setIdentity] = React.useState<string>("");

  const setIdentityHandler = (identity: string) => {
    setIdentity(identity);
  };

  return (
    <NavbarContext.Provider
      value={{
        identity,
        setIdentity: setIdentityHandler,
      }}
    >
      {children}
    </NavbarContext.Provider>
  );
};
