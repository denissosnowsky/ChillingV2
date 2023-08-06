"use client";

import { useEffect, useState } from "react";

import { NOTIFICATION_MESSAGES } from "@/constants";
import { useMakeNotification, useMakeQuery } from "@/hooks";
import { AccountInfo } from "@/types";

type UseUserInfo = {
  data: AccountInfo | null;
  isLoading: boolean;
  error: Error | null;
};

export const useUserInfo = (id: string): UseUserInfo => {
  const [isUserInfoLoaded, setIsUserInfoLoaded] = useState(false);

  const { dispatchError } = useMakeNotification();

  const {
    runContractFunction: getAccountInfo,
    data,
    error,
    isFetching,
    isLoading,
  } = useMakeQuery<AccountInfo>({
    functionName: "getAccountInfo",
    params: {
      _account: id,
    },
  });

  useEffect(() => {
    const getUserInfo = async () => {
      await getAccountInfo({
        onError: () => dispatchError(NOTIFICATION_MESSAGES.defaultError),
        onComplete: () => {
          setIsUserInfoLoaded(true);
        },
      });
    };

    getUserInfo();
  }, [getAccountInfo, dispatchError]);

  return {
    error,
    data,
    isLoading: !isUserInfoLoaded || isFetching || isLoading,
  };
};
