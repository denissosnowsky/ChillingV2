import { Dispatch, SetStateAction } from "react";

import { NOTIFICATION_MESSAGES } from "@/constants";
import { useMakeNotification, useMakeQuery } from "@/hooks";

type UseTransfer = {
  isLoading: boolean;
  transfer: (address: string, sum: number) => Promise<void>;
};

export const useTransfer = (
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  refetchBalance: () => void
): UseTransfer => {
  const { dispatchError, dispatchTransaction } = useMakeNotification();

  const {
    runContractFunction: makeTransfer,
    isFetching,
    isLoading,
  } = useMakeQuery<void>({
    functionName: "makeTransfer",
  });

  const transfer = async (address: string, sum: number) => {
    await makeTransfer({
      onError: () => {
        dispatchError(NOTIFICATION_MESSAGES.defaultError);
        setIsLoading(false);
      },
      onSuccess: async (tx) => {
        await dispatchTransaction(
          NOTIFICATION_MESSAGES.moneySent,
          tx as { wait: Function }
        );
        refetchBalance();
        setIsLoading(false);
      },
      params: {
        params: {
          _to: address,
        },
        msgValue: sum,
      },
    });
  };

  return {
    transfer,
    isLoading: isLoading || isFetching,
  };
};
