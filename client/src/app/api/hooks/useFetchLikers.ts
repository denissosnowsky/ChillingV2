import { useCallback, useEffect, useState } from "react";

import { useMakeNotification, useMakeQuery } from "@/hooks";
import { UseFetchUsers, UserAccountShort } from "@/types";
import { NOTIFICATION_MESSAGES } from "@/constants";

export const useFetchLikers = (
  userId: string,
  postId: string
): UseFetchUsers => {
  const LIMIT = 10;

  const [cursor, setCursor] = useState(0);
  const [users, setUsers] = useState<UserAccountShort[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [isUsersLoaded, setIsUsersLoaded] = useState(false);

  const { dispatchError } = useMakeNotification();

  const {
    runContractFunction: getPostLikers,
    data,
    error,
    isFetching,
    isLoading,
  } = useMakeQuery<{ users: UserAccountShort[]; hasMore: boolean }>({
    functionName: "getPostLikers",
  });

  useEffect(() => {
    if (data) {
      setUsers((prev) => [...prev, ...data.users]);
      setHasMore(data.hasMore);
      setCursor((prev) => prev + LIMIT);
    }
  }, [data]);

  useEffect(() => {
    const getUsers = async () => {
      await getPostLikers({
        onError: () => dispatchError(NOTIFICATION_MESSAGES.defaultError),
        onComplete: () => {
          setIsUsersLoaded(true);
        },
        params: {
          params: {
            _account: userId,
            _index: postId,
            _cursor: cursor,
            _limit: LIMIT,
          },
        },
      });
    };

    getUsers();
  }, []);

  const fetchMore = useCallback(async () => {
    if (hasMore) {
      await getPostLikers({
        onError: () => dispatchError(NOTIFICATION_MESSAGES.defaultError),
        params: {
          params: {
            _account: userId,
            _index: postId,
            _cursor: cursor,
            _limit: LIMIT,
          },
        },
      });
    }
  }, [dispatchError, getPostLikers, userId, cursor, LIMIT, hasMore, postId]);

  return {
    error,
    data: users,
    hasMore,
    fetchMore,
    isLoading: !isUsersLoaded || isFetching || isLoading,
  };
};
