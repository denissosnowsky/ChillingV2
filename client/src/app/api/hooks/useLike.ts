import { Dispatch, SetStateAction } from "react";

import { NOTIFICATION_MESSAGES } from "@/constants";
import { useMakeNotification, useMakeQuery } from "@/hooks";

type UseLike = {
  isLoading: boolean;
  like: (address: string, index: string) => Promise<void>;
};

export const useLike = (
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  onLikeSuccess: () => void,
  onCancelDisikeSuccess: () => void
): UseLike => {
  const { dispatchError } = useMakeNotification();

  const {
    runContractFunction: likePost,
    isFetching,
    isLoading,
  } = useMakeQuery<void>({
    functionName: "likePost",
  });

  const like = async (address: string, index: string) => {
    await likePost({
      onError: () => {
        dispatchError(NOTIFICATION_MESSAGES.defaultError);
        setIsLoading(false);
      },
      onSuccess: async (tx) => {
        await (tx as { wait: Function }).wait(1);
        onLikeSuccess();
        onCancelDisikeSuccess();
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
    like,
    isLoading: isLoading || isFetching,
  };
};
