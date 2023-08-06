"use client";

import { createContext } from "react";

import { useFetchBalance } from "@/api/hooks";

export const BalanceContext = createContext({
  balance: "",
  refetchBalance: () => {},
});

export const BalanceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { balance, refetchBalance } = useFetchBalance();

  return (
    <BalanceContext.Provider value={{ balance, refetchBalance }}>
      {children}
    </BalanceContext.Provider>
  );
};
