import { Dispatch, SetStateAction } from "react";

import { NOTIFICATION_MESSAGES } from "@/constants";
import { useMakeNotification, useMakeQuery } from "@/hooks";

type UseCreatePost = {
  isLoading: boolean;
  createPost: (text: string, image: string) => Promise<void>;
};

export const useCreatePost = (
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  resetPostsToFirstPage: () => Promise<void>,
  onClose?: () => void
): UseCreatePost => {
  const { dispatchError, dispatchTransaction } = useMakeNotification();

  const {
    runContractFunction: createUserPost,
    isFetching,
    isLoading,
  } = useMakeQuery({
    functionName: "createPost",
  });

  const createPost = async (text: string, image: string) => {
    await createUserPost({
      params: {
        params: {
          _text: text,
          _image: image.length ? image : " ",
        },
      },
      onError: () => {
        dispatchError(NOTIFICATION_MESSAGES.defaultError);
        setIsLoading(false);
      },
      onSuccess: async (tx) => {
        await dispatchTransaction(
          NOTIFICATION_MESSAGES.postCreated,
          tx as { wait: Function }
        );
        await resetPostsToFirstPage();
        setIsLoading(false);
        if (onClose) onClose();
      },
    });
  };

  return {
    isLoading: isFetching || isLoading,
    createPost,
  };
};
