import { Dispatch, SetStateAction } from "react";

import { NOTIFICATION_MESSAGES } from "@/constants";
import { useMakeNotification, useMakeQuery } from "@/hooks";

type UseFollow = {
  isLoading: boolean;
  followUser: (address: string) => void;
};

export const useFollow = (
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setIsSenderFollowing: Dispatch<SetStateAction<boolean>>
): UseFollow => {
  const { dispatchError } = useMakeNotification();

  const {
    runContractFunction: follow,
    isFetching,
    isLoading,
  } = useMakeQuery<void>({
    functionName: "follow",
  });

  const followUser = (address: string) => {
    follow({
      onError: () => {
        dispatchError(NOTIFICATION_MESSAGES.defaultError);
        setIsLoading(false);
      },
      onSuccess: async (tx) => {
        await (tx as { wait: Function }).wait(1);
        setIsSenderFollowing(true);
        setIsLoading(false);
      },
      params: {
        params: {
          _to: address,
        },
      },
    });
  };

  return {
    followUser,
    isLoading: isLoading || isFetching,
  };
};
