import { Dispatch, SetStateAction } from "react";

import { NOTIFICATION_MESSAGES } from "@/constants";
import { useMakeNotification, useMakeQuery } from "@/hooks";

export const useChangeDescription = (
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  onChangeDescriptionSuccess: (newDescription: string) => void
) => {
  const { dispatchError } = useMakeNotification();

  const {
    runContractFunction: changeDescription,
    isFetching,
    isLoading,
  } = useMakeQuery<void>({
    functionName: "changeDescription",
  });

  const changeUserDescription = async (description: string) => {
    await changeDescription({
      onError: () => {
        dispatchError(NOTIFICATION_MESSAGES.defaultError);
        setIsLoading(false);
      },
      onSuccess: async (tx) => {
        await (tx as { wait: Function }).wait(1);
        onChangeDescriptionSuccess(description);
        setIsLoading(false);
      },
      params: {
        params: {
          _description: description,
        },
      },
    });
  };

  return {
    changeUserDescription,
    isLoading: isLoading || isFetching,
  };
};
