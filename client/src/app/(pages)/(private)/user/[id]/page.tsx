"use client";

import { redirect } from "next/navigation";
import { useMoralis } from "react-moralis";

import { FullScreenSpinner } from "@/components/common/FullScreenSpinner";

import { UserPosts } from "./components/UserPosts";
import { UserHeader } from "./components/UserHeader";
import { useUserInfo, useUserPosts } from "@/api/hooks";

type UserIdProps = {
  params: { id: string };
};

const UserId = ({ params: { id: idAddress } }: UserIdProps): JSX.Element => {
  const { account: accountAddress } = useMoralis();

  const id = idAddress.toLowerCase();
  const account = accountAddress?.toLowerCase();

  const {
    data: userInfo,
    error: userInfoError,
    isLoading: userInfoIsLoading,
  } = useUserInfo(id);

  const {
    data: userPosts,
    error: userPostsError,
    resetPostsToFirstPage,
    hasMore: hasMorePosts,
    fetchMore: fetchMorePosts,
    isLoading: userPostsAreLoading,
  } = useUserPosts(id);

  if (userInfoIsLoading || (userPostsAreLoading && !userPosts.length)) {
    return (
      <div className="page flex flex-col">
        <FullScreenSpinner className="mb-20" />
      </div>
    );
  }

  if (userInfoError || userPostsError) {
    redirect("/");
  }

  const isOwner = id === account;

  return (
    <div className="page">
      <UserHeader
        id={id}
        isOwner={isOwner}
        name={userInfo!.name}
        accountAddress={account ?? ""}
        avatar={userInfo!.image.trim()}
        description={userInfo!.description}
        resetPostsToFirstPage={resetPostsToFirstPage}
        isSenderFollowing={userInfo!.isSenderFollowing}
        followersCount={userInfo!.followersCount.toString()}
        followingsCount={userInfo!.followingsCount.toString()}
      />
      <UserPosts
        id={id}
        posts={userPosts}
        hasMore={hasMorePosts}
        fetchMore={fetchMorePosts}
        accountAddress={account ?? ""}
        isLoading={userPostsAreLoading}
      />
    </div>
  );
};

export default UserId;
