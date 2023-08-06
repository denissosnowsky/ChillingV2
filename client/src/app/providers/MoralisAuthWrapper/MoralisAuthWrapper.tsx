"use client";

import React, { useEffect } from "react";
import { useMoralis } from "react-moralis";

import { useMakeNotification } from "@/hooks";
import { contractAddresses } from "@/constants";
import {
  LOCAL_STORAGE_CONFIG,
  NOTIFICATION_MESSAGES,
} from "@/constants/common";

const MoralisAuthWrapper = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const { Moralis, deactivateWeb3, chainId, account } = useMoralis();
  const { dispatchError } = useMakeNotification();

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      if (!account) {
        window.localStorage.removeItem(LOCAL_STORAGE_CONFIG.key);
        deactivateWeb3();
      }
    });
  }, [Moralis, deactivateWeb3]);

  useEffect(() => {
    Moralis.onChainChanged((chainIdHex) => {
      const chainId = parseInt(chainIdHex ?? "").toString();

      if (!(chainId in contractAddresses)) {
        window.localStorage.removeItem(LOCAL_STORAGE_CONFIG.key);
        deactivateWeb3();
        dispatchError(NOTIFICATION_MESSAGES.notSupportedChain);
      }
    });
  }, [Moralis, deactivateWeb3, dispatchError]);

  return <>{children}</>;
};

export default MoralisAuthWrapper;
