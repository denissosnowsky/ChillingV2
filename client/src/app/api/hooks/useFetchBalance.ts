import { ethers } from "ethers";
import { useMoralis } from "react-moralis";
import { useCallback, useEffect, useState } from "react";

import { useMakeNotification } from "@/hooks";
import { NOTIFICATION_MESSAGES } from "@/constants";

type UseFetchBalance = {
  balance: string;
  isBalanceLoaded: boolean;
  refetchBalance: () => void;
};

export const useFetchBalance = (): UseFetchBalance => {
  const [balance, setBalance] = useState("");
  const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>(null);
  const [isBalanceLoaded, setIsBalanceLoaded] = useState(false);

  const { account, web3 } = useMoralis();

  const { dispatchError } = useMakeNotification();

  const getBalance = useCallback(async () => {
    setIsBalanceLoaded(false);

    try {
      if (account) {
        const balance = ethers.utils.formatUnits(
          await web3?.getBalance(account)!,
          "ether"
        );
        setBalance(balance);
      }
    } catch {
      dispatchError(NOTIFICATION_MESSAGES.defaultError);
    }
    setIsBalanceLoaded(true);
  }, [account, dispatchError, web3]);

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  useEffect(() => {
    if (intervalId) clearInterval(intervalId);
  }, [balance]);

  const refetchBalance = () => {
    const newIntervalId = setInterval(() => {
      getBalance();
    }, 1000);

    if (intervalId) clearInterval(intervalId);
    setIntervalId(newIntervalId);
  };

  return {
    balance,
    refetchBalance,
    isBalanceLoaded,
  };
};
