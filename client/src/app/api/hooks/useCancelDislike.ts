import { Dispatch, SetStateAction } from "react";

import { NOTIFICATION_MESSAGES } from "@/constants";
import { useMakeNotification, useMakeQuery } from "@/hooks";

type UseCancelDislike = {
  isLoading: boolean;
  cancelDislike: (address: string, index: string) => void;
};

export const useCancelDislike = (
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  onCancelDisikeSuccess: () => void
): UseCancelDislike => {
  const { dispatchError } = useMakeNotification();

  const {
    runContractFunction: cancelPostDislike,
    isFetching,
    isLoading,
  } = useMakeQuery<void>({
    functionName: "cancelPostDislike",
  });

  const cancelDislike = (address: string, index: string) => {
    cancelPostDislike({
      onError: () => {
        dispatchError(NOTIFICATION_MESSAGES.defaultError);
        setIsLoading(false);
      },
      onSuccess: async (tx) => {
        await (tx as { wait: Function }).wait(1);
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
    cancelDislike,
    isLoading: isLoading || isFetching,
  };
};
