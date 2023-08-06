"use client";

import { useLayoutEffect, useState } from "react";
import { useMoralis } from "react-moralis";

import { LOCAL_STORAGE_CONFIG } from "@/constants/common";

type UseIsConnectedToWeb3 = {
  account: string | null;
  isWeb3EnableLoading: boolean;
  isConnectedToAccount: boolean;
  isAuthenticated: boolean;
  connectToWallet: () => Promise<void>;
};

export const useIsConnectedToWeb3 = (): UseIsConnectedToWeb3 => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { enableWeb3, isWeb3Enabled, account, isWeb3EnableLoading } =
    useMoralis();

  const isConnectedToAccount = isWeb3Enabled && !!account;

  useLayoutEffect(() => {
    if (isConnectedToAccount) {
      setIsAuthenticated(true);
      return;
    }

    const autoConnect = async () => {
      if (window && window.localStorage.getItem(LOCAL_STORAGE_CONFIG.key)) {
        await enableWeb3();
      }

      setIsAuthenticated(true);
    };

    autoConnect();
  }, [isConnectedToAccount, enableWeb3]);

  const connectToWallet = async () => {
    const success = await enableWeb3();
    if (window && success) {
      window.localStorage.setItem(
        LOCAL_STORAGE_CONFIG.key,
        LOCAL_STORAGE_CONFIG.value
      );
    }
  };

  return {
    account,
    connectToWallet,
    isAuthenticated,
    isWeb3EnableLoading,
    isConnectedToAccount,
  };
};
