import { useCallback, useEffect, useState } from "react";

import { Comment } from "@/types";
import { NOTIFICATION_MESSAGES } from "@/constants";
import { useMakeNotification, useMakeQuery } from "@/hooks";

type UseFetchComments = {
  data: Comment[];
  error: Error | null;
  isLoading: boolean;
  resetComments: () => Promise<void>;
};

export const useFetchComments = (
  address: string,
  index: string
): UseFetchComments => {
  const [comments, setComments] = useState<Comment[]>([]);

  const [isCommentsLoaded, setIsCommentsLoaded] = useState(false);

  const { dispatchError } = useMakeNotification();

  const {
    runContractFunction: getPostComments,
    data,
    error,
    isFetching,
    isLoading: isCommentsLoading,
  } = useMakeQuery<Comment[]>({
    functionName: "getPostComments",
  });

  const getComments = useCallback(async () => {
    setIsCommentsLoaded(false);
    await getPostComments({
      onError: () => dispatchError(NOTIFICATION_MESSAGES.defaultError),
      onComplete: () => {
        setIsCommentsLoaded(true);
      },
      params: {
        params: {
          _user: address,
          _index: index,
        },
      },
    });
  }, [address, dispatchError, getPostComments, index]);

  useEffect(() => {
    getComments();
  }, [getComments]);

  useEffect(() => {
    if (data) {
      setComments([...data]);
    }
  }, [data]);

  const resetComments = async () => {
    await getComments();
  };

  return {
    error,
    resetComments,
    data: comments.reverse(),
    isLoading: !isCommentsLoaded || isCommentsLoading || isFetching,
  };
};
