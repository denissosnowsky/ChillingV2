import { Dispatch, SetStateAction } from "react";

import { useMakeNotification, useMakeQuery } from "@/hooks";
import { NOTIFICATION_MESSAGES } from "@/constants";

type UseCreateComment = {
  isLoading: boolean;
  createPostComment: (
    text: string,
    author: string,
    index: string
  ) => Promise<void>;
};

export const useCreateComment = (
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  resetComments: () => Promise<void>,
  onCommentCreate: () => void
): UseCreateComment => {
  const { dispatchError, dispatchTransaction } = useMakeNotification();

  const {
    runContractFunction: createComment,
    isFetching,
    isLoading,
  } = useMakeQuery({
    functionName: "createComment",
  });

  const createPostComment = async (
    text: string,
    author: string,
    index: string
  ) => {
    await createComment({
      params: {
        params: {
          _text: text,
          _author: author,
          _index: index,
        },
      },
      onError: () => {
        dispatchError(NOTIFICATION_MESSAGES.defaultError);
        setIsLoading(false);
      },
      onSuccess: async (tx) => {
        await dispatchTransaction(
          NOTIFICATION_MESSAGES.commentCreated,
          tx as { wait: Function }
        );
        await resetComments();
        onCommentCreate();
        setIsLoading(false);
      },
    });
  };

  return {
    isLoading: isFetching || isLoading,
    createPostComment,
  };
};
