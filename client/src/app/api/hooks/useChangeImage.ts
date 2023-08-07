import { Dispatch, SetStateAction } from "react";

import {
  useMakeNotification,
  useMakeQuery,
  useUploadImageToIpfs,
} from "@/hooks";
import { NOTIFICATION_MESSAGES } from "@/constants";

export const useChangeImage = (
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  onChangeImageSuccess: (newImage: string) => void
) => {
  const uploadImageToIpfs = useUploadImageToIpfs();

  const { dispatchError } = useMakeNotification();

  const {
    runContractFunction: changeImage,
    isFetching,
    isLoading,
  } = useMakeQuery<void>({
    functionName: "changeImage",
  });

  const changeUserImage = async (image: Blob | undefined) => {
    const finalImage = !!image ? await uploadImageToIpfs(image) : " ";

    await changeImage({
      onError: () => {
        dispatchError(NOTIFICATION_MESSAGES.defaultError);
        setIsLoading(false);
      },
      onSuccess: async (tx) => {
        await (tx as { wait: Function }).wait(1);

        onChangeImageSuccess(finalImage);
        setIsLoading(false);
      },
      params: {
        params: {
          _image: finalImage,
        },
      },
    });
  };

  return {
    changeUserImage,
    isLoading: isLoading || isFetching,
  };
};
