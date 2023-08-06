import { Dispatch, SetStateAction } from "react";

import { NOTIFICATION_MESSAGES } from "@/constants";
import { useMakeNotification, useMakeQuery } from "@/hooks";

type UseUnfollow = {
  isLoading: boolean;
  unfollowUser: (address: string) => void;
};

export const useUnfollow = (
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setIsSenderFollowing: Dispatch<SetStateAction<boolean>>
): UseUnfollow => {
  const { dispatchError } = useMakeNotification();

  const {
    runContractFunction: unfollow,
    isFetching,
    isLoading,
  } = useMakeQuery<void>({
    functionName: "unfollow",
  });

  const unfollowUser = (address: string) => {
    unfollow({
      onError: () => {
        dispatchError(NOTIFICATION_MESSAGES.defaultError);
        setIsLoading(false);
      },
      onSuccess: async (tx) => {
        await (tx as { wait: Function }).wait(1);
        setIsSenderFollowing(false);
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
    unfollowUser,
    isLoading: isLoading || isFetching,
  };
};
