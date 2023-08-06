import { useCallback, useEffect, useState } from "react";

import { useMakeNotification, useMakeQuery } from "@/hooks";
import { UseFetchUsers, UserAccountShort } from "@/types";
import { NOTIFICATION_MESSAGES } from "@/constants";

export const useFetchFollowings = (id: string): UseFetchUsers => {
  const LIMIT = 10;

  const [cursor, setCursor] = useState(0);
  const [users, setUsers] = useState<UserAccountShort[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [isUsersLoaded, setIsUsersLoaded] = useState(false);

  const { dispatchError } = useMakeNotification();

  const {
    runContractFunction: getAccountFollowings,
    data,
    error,
    isFetching,
    isLoading,
  } = useMakeQuery<{ users: UserAccountShort[]; hasMore: boolean }>({
    functionName: "getFollowing",
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
      await getAccountFollowings({
        onError: () => dispatchError(NOTIFICATION_MESSAGES.defaultError),
        onComplete: () => {
          setIsUsersLoaded(true);
        },
        params: {
          params: {
            _account: id,
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
      await getAccountFollowings({
        onError: () => dispatchError(NOTIFICATION_MESSAGES.defaultError),
        params: {
          params: {
            _account: id,
            _cursor: cursor,
            _limit: LIMIT,
          },
        },
      });
    }
  }, [dispatchError, getAccountFollowings, id, cursor, LIMIT, hasMore]);

  return {
    error,
    data: users,
    hasMore,
    fetchMore,
    isLoading: !isUsersLoaded || isFetching || isLoading,
  };
};
