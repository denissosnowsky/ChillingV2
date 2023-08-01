"use client";

import React, { useEffect } from "react";
import { useMoralis } from "react-moralis";

import { LOCAL_STORAGE_CONFIG } from "@/constants";

const MoralisAuthWrapper = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const { Moralis, deactivateWeb3 } = useMoralis();

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      if (!account) {
        window.localStorage.removeItem(LOCAL_STORAGE_CONFIG.key);
        deactivateWeb3();
      }
    });
  }, [Moralis, deactivateWeb3]);

  return <>{children}</>;
};

export default MoralisAuthWrapper;
