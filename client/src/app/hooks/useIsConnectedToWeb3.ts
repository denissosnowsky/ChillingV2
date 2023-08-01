"use client";

import { useLayoutEffect } from "react";
import { useMoralis } from "react-moralis";
import { LOCAL_STORAGE_CONFIG } from "@/constants";

type UseIsConnectedToWeb3 = {
  isWeb3EnableLoading: boolean;
  isConnectedToAccount: boolean;
  connectToWallet: () => Promise<void>;
};

export const useIsConnectedToWeb3 = (): UseIsConnectedToWeb3 => {
  const { enableWeb3, isWeb3Enabled, account, isWeb3EnableLoading } =
    useMoralis();

  const isConnectedToAccount = isWeb3Enabled && !!account;

  useLayoutEffect(() => {
    if (isConnectedToAccount) return;

    const autoConnect = async () => {
      if (window && window.localStorage.getItem(LOCAL_STORAGE_CONFIG.key)) {
        await enableWeb3();
      }
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
    isConnectedToAccount,
    isWeb3EnableLoading,
    connectToWallet,
  };
};
