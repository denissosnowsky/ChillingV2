import { Dispatch, SetStateAction } from "react";

import { NOTIFICATION_MESSAGES } from "@/constants";
import { useMakeNotification, useMakeQuery } from "@/hooks";

type UseDuslike = {
  isLoading: boolean;
  dislike: (address: string, index: string) => Promise<void>;
};

export const useDislike = (
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  onDislikeSuccess: () => void,
  onCancelLikeSuccess: () => void
): UseDuslike => {
  const { dispatchError } = useMakeNotification();

  const {
    runContractFunction: dislikePost,
    isFetching,
    isLoading,
  } = useMakeQuery<void>({
    functionName: "dislikePost",
  });

  const dislike = async (address: string, index: string) => {
    await dislikePost({
      onError: () => {
        dispatchError(NOTIFICATION_MESSAGES.defaultError);
        setIsLoading(false);
      },
      onSuccess: async (tx) => {
        await (tx as { wait: Function }).wait(1);
        onDislikeSuccess();
        onCancelLikeSuccess();
        setIsLoading(false);
      },
      params: {
        params: {
          _author: address,
          _index: index,
        },
      },
    });
  };

  return {
    dislike,
    isLoading: isLoading || isFetching,
  };
};
