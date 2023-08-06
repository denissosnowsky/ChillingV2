import { Dispatch, SetStateAction } from "react";

import { NOTIFICATION_MESSAGES } from "@/constants";
import { useMakeNotification, useMakeQuery } from "@/hooks";

type UseCancelLike = {
  isLoading: boolean;
  cancelLike: (address: string, index: string) => void;
};

export const useCancelLike = (
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  onCancelLikeSuccess: () => void
): UseCancelLike => {
  const { dispatchError } = useMakeNotification();

  const {
    runContractFunction: cancelPostLike,
    isFetching,
    isLoading,
  } = useMakeQuery<void>({
    functionName: "cancelPostLike",
  });

  const cancelLike = (address: string, index: string) => {
    cancelPostLike({
      onError: () => {
        dispatchError(NOTIFICATION_MESSAGES.defaultError);
        setIsLoading(false);
      },
      onSuccess: async (tx) => {
        await (tx as { wait: Function }).wait(1);
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
    cancelLike,
    isLoading: isLoading || isFetching,
  };
};
