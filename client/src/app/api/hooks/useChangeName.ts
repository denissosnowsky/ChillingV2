import { Dispatch, SetStateAction } from "react";

import { NOTIFICATION_MESSAGES } from "@/constants";
import { useMakeNotification, useMakeQuery } from "@/hooks";

export const useChangeName = (
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  onChangeNameSuccess: (newName: string) => void
) => {
  const { dispatchError } = useMakeNotification();

  const {
    runContractFunction: changeName,
    isFetching,
    isLoading,
  } = useMakeQuery<void>({
    functionName: "changeName",
  });

  const changeUserName = async (name: string) => {
    await changeName({
      onError: () => {
        dispatchError(NOTIFICATION_MESSAGES.defaultError);
        setIsLoading(false);
      },
      onSuccess: async (tx) => {
        await (tx as { wait: Function }).wait(1);
        onChangeNameSuccess(name);
        setIsLoading(false);
      },
      params: {
        params: {
          _name: name,
        },
      },
    });
  };

  return {
    changeUserName,
    isLoading: isLoading || isFetching,
  };
};
