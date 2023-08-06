import { Dispatch, SetStateAction } from "react";

import { NOTIFICATION_MESSAGES } from "@/constants";
import { useMakeNotification, useMakeQuery } from "@/hooks";

export const useChangeImage = (
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  onChangeImageSuccess: (newImage: string) => void
) => {
  const { dispatchError } = useMakeNotification();

  const {
    runContractFunction: changeImage,
    isFetching,
    isLoading,
  } = useMakeQuery<void>({
    functionName: "changeImage",
  });

  const changeUserImage = async (image: string) => {
    await changeImage({
      onError: () => {
        dispatchError(NOTIFICATION_MESSAGES.defaultError);
        setIsLoading(false);
      },
      onSuccess: async (tx) => {
        await (tx as { wait: Function }).wait(1);
        onChangeImageSuccess(image);
        setIsLoading(false);
      },
      params: {
        params: {
          _image: image,
        },
      },
    });
  };

  return {
    changeUserImage,
    isLoading: isLoading || isFetching,
  };
};
