"use client";

import { useCallback, useEffect, useState } from "react";

import { NOTIFICATION_MESSAGES } from "@/constants";
import { useMakeNotification, useMakeQuery } from "@/hooks";
import { AccountPost } from "@/types";

type UseUserPosts = {
  data: AccountPost[];
  hasMore: boolean;
  isLoading: boolean;
  error: Error | null;
  fetchMore: () => Promise<void>;
  resetPostsToFirstPage: () => Promise<void>;
};

export const useUserPosts = (id: string): UseUserPosts => {
  const LIMIT = 10;

  const [cursor, setCursor] = useState(0);
  const [posts, setPosts] = useState<AccountPost[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [isPostsLoaded, setIsPostsLoaded] = useState(false);

  const { dispatchError } = useMakeNotification();

  const {
    runContractFunction: getAccountPosts,
    data,
    error,
    isFetching,
    isLoading,
  } = useMakeQuery<{ posts: AccountPost[]; hasMore: boolean }>({
    functionName: "getAccountPosts",
  });
  console.log(error)
  useEffect(() => {
    if (data) {
      console.log(data)
      setPosts((prev) => [...prev, ...data.posts]);
      setHasMore(data.hasMore);
      setCursor((prev) => prev + LIMIT);
    }
  }, [data]);

  useEffect(() => {
    const getUserPosts = async () => {
      await getAccountPosts({
        onError: () => dispatchError(NOTIFICATION_MESSAGES.defaultError),
        onComplete: () => {
          setIsPostsLoaded(true);
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

    getUserPosts();
  }, []);

  const fetchMore = useCallback(async () => {
    if (hasMore) {
      await getAccountPosts({
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
  }, [dispatchError, getAccountPosts, id, cursor, LIMIT, hasMore]);

  const resetPostsToFirstPage = useCallback(async () => {
    setPosts([]);
    setCursor(0);

    await getAccountPosts({
      onError: () => dispatchError(NOTIFICATION_MESSAGES.defaultError),
      params: {
        params: {
          _account: id,
          _cursor: 0,
          _limit: LIMIT,
        },
      },
    });
  }, [dispatchError, getAccountPosts, id]);

  return {
    error,
    hasMore,
    fetchMore,
    data: posts,
    resetPostsToFirstPage,
    isLoading: !isPostsLoaded || isFetching || isLoading,
  };
};
