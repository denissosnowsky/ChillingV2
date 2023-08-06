"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { useMoralis } from "react-moralis";

import {
  useIsConnectedToWeb3,
  useMakeQuery,
  useMakeNotification,
} from "@/hooks";
import { NOTIFICATION_MESSAGES } from "@/constants";
import { AccountInfo } from "@/types";

type UseUserAuth = {
  shouldShowLoading: boolean;
  address: string;
  data: AccountInfo | null;
};

export const useUserAuth = (): UseUserAuth => {
  const [isUserInfoLoaded, setIsUserInfoLoaded] = useState(false);

  const { account } = useMoralis();
  const { dispatchError } = useMakeNotification();
  const { isConnectedToAccount, isAuthenticated } = useIsConnectedToWeb3();

  const {
    data,
    error,
    isFetching,
    isLoading,
    runContractFunction: getAccountInfo,
  } = useMakeQuery<AccountInfo>({
    functionName: "getAccountInfo",
    params: {
      _account: account,
    },
  });

  const shouldShowLoading =
    !data ||
    isLoading ||
    isFetching ||
    !isAuthenticated ||
    !isUserInfoLoaded ||
    !isConnectedToAccount;

  useEffect(() => {
    if ((!isConnectedToAccount && isAuthenticated) || error) redirect("/");
  }, [isConnectedToAccount, error, isAuthenticated]);

  useEffect(() => {
    const getUserInfo = async () => {
      if (isConnectedToAccount) {
        setIsUserInfoLoaded(false);

        await getAccountInfo({
          onError: () => dispatchError(NOTIFICATION_MESSAGES.notSignedUp),
          onComplete: () => {
            setIsUserInfoLoaded(true);
          },
        });
      }
    };

    getUserInfo();
  }, [isConnectedToAccount, getAccountInfo, dispatchError]);

  return {
    data: data,
    shouldShowLoading,
    address: account?.toLowerCase() ?? "",
  };
};
