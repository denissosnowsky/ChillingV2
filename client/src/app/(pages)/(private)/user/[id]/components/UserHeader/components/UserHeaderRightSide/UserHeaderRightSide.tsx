"use client";

import { Cog } from "@web3uikit/icons";
import { Dispatch, SetStateAction, useState } from "react";

import { UseFetchUsers } from "@/types";
import { Button } from "@/components/common/Button";
import { MEDIUM_BUTTON_FONT_SIZE } from "@/constants/common";
import {
  useFetchFollowers,
  useFetchFollowings,
  useFollow,
  useUnfollow,
} from "@/api/hooks";

type UserHeaderRightSide = {
  id: string;
  name: string;
  isOwner: boolean;
  description: string;
  followersCount: string;
  followingsCount: string;
  isSenderFollowing: boolean;
  openSettingsModal: () => void;
  openUserModalWithHeaderText: Dispatch<
    SetStateAction<"Followers" | "Followings" | "">
  >;
  setFetchUsersHook: Dispatch<
    SetStateAction<((id: string) => UseFetchUsers) | null>
  >;
};

const UserHeaderRightSide = ({
  id,
  name,
  isOwner,
  description,
  followersCount,
  followingsCount,
  setFetchUsersHook,
  openSettingsModal,
  openUserModalWithHeaderText,
  isSenderFollowing: startingIsSenderFollowing,
}: UserHeaderRightSide): JSX.Element => {
  const [isSenderFollowing, setIsSenderFollowing] = useState(
    startingIsSenderFollowing
  );
  const [isLoading, setIsLoading] = useState(false);

  const { followUser } = useFollow(setIsLoading, setIsSenderFollowing);
  const { unfollowUser } = useUnfollow(setIsLoading, setIsSenderFollowing);

  const openFollowersModal = () => {
    setFetchUsersHook(() => useFetchFollowers);
    openUserModalWithHeaderText("Followers");
  };

  const openFollowingsModal = () => {
    setFetchUsersHook(() => useFetchFollowings);
    openUserModalWithHeaderText("Followings");
  };

  const follow = () => {
    setIsLoading(true);
    followUser(id);
  };

  const unfollow = () => {
    setIsLoading(true);
    unfollowUser(id);
  };

  return (
    <div className="flex flex-col justify-between overflow-hidden">
      <div className=" flex flex-col h-[210px]">
        <div className="font-bold text-3xl mb-5 flex gap-3">
          <span>{name}</span>
          {!isOwner && isSenderFollowing && (
            <Button
              color="red"
              size="small"
              text="Unfollow"
              theme="colored"
              onClick={unfollow}
              isLoading={isLoading}
            />
          )}
          {!isOwner && !isSenderFollowing && (
            <Button
              size="small"
              color="blue"
              text="Follow"
              theme="colored"
              onClick={follow}
              isLoading={isLoading}
            />
          )}
        </div>
        <div className="text-lg overflow-auto break-words">{description}</div>
      </div>
      <div className="flex items-center justify-around">
        <Button
          color="green"
          text={`${followersCount} Followers`}
          size="large"
          theme="colored"
          onClick={openFollowersModal}
        />
        <Button
          color="green"
          text={`${followingsCount} Followings`}
          size="large"
          theme="colored"
          onClick={openFollowingsModal}
        />
        <Cog
          fontSize={MEDIUM_BUTTON_FONT_SIZE}
          className="cursor-pointer text-secondary-light"
          onClick={openSettingsModal}
        />
      </div>
    </div>
  );
};

export default UserHeaderRightSide;
