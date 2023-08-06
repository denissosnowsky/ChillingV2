"use client";

import { useContext, useState } from "react";

import { UseFetchUsers } from "@/types";
import { BalanceContext } from "@/contexts";
import { TransferModal } from "@/components/TransferModal";
import { SettingsModal } from "@/components/SettingsModal";
import { CreatePostModal } from "@/components/CreatePostModal";
import { FollowersFollowingsModal } from "@/components/FollowersFollowingsModal";

import { UserHeaderLeftSide } from "./components/UserHeaderLeftSide";
import { UserHeaderRightSide } from "./components/UserHeaderRightSide";

type UserHeaderProps = {
  id: string;
  name: string;
  avatar: string;
  isOwner: boolean;
  description: string;
  accountAddress: string;
  followersCount: string;
  followingsCount: string;
  isSenderFollowing: boolean;
  resetPostsToFirstPage: () => Promise<void>;
};

const UserHeader = ({
  id,
  isOwner,
  followersCount,
  accountAddress,
  name: initName,
  followingsCount,
  isSenderFollowing,
  avatar: avatarInit,
  resetPostsToFirstPage,
  description: descriptionInit,
}: UserHeaderProps): JSX.Element => {
  const [name, setName] = useState(initName);
  const [image, setImage] = useState(avatarInit);
  const [description, setDescription] = useState(descriptionInit);

  const { refetchBalance } = useContext(BalanceContext);

  const [userModalHeaderText, setUserModalHeaderText] = useState<
    "Followers" | "Followings" | ""
  >("");
  const [fetchUsersHook, setFetchUsersHook] = useState<
    ((id: string) => UseFetchUsers) | null
  >(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  const onCloseUserModal = () => setUserModalHeaderText("");
  const openSettingsModal = () => setIsSettingsModalOpen(true);
  const openTransferModal = () => setIsTransferModalOpen(true);
  const onCloseSettinsModal = () => setIsSettingsModalOpen(false);
  const onCloseTransferModal = () => setIsTransferModalOpen(false);
  const openCreatePostModal = () => setIsCreatePostModalOpen(true);
  const onCloseCreatePostModal = () => setIsCreatePostModalOpen(false);

  return (
    <div className="w-full h-[270px] grid grid-cols-[1fr_2fr] gap-10">
      <UserHeaderLeftSide
        avatar={image}
        isOwner={isOwner}
        openTransferModal={openTransferModal}
        openCreatePostModal={openCreatePostModal}
      />
      <UserHeaderRightSide
        id={id}
        name={name}
        isOwner={isOwner}
        description={description}
        followersCount={followersCount}
        followingsCount={followingsCount}
        isSenderFollowing={isSenderFollowing}
        openSettingsModal={openSettingsModal}
        setFetchUsersHook={setFetchUsersHook}
        openUserModalWithHeaderText={setUserModalHeaderText}
      />
      {userModalHeaderText && (
        <FollowersFollowingsModal
          id={id}
          who={userModalHeaderText}
          onClose={onCloseUserModal}
          accountAddress={accountAddress}
          useFetchUsers={fetchUsersHook!}
          isVisible={!!userModalHeaderText}
        />
      )}
      {isSettingsModalOpen && (
        <SettingsModal
          setName={setName}
          setImage={setImage}
          onClose={onCloseSettinsModal}
          isVisible={isSettingsModalOpen}
          setDescription={setDescription}
        />
      )}
      {isCreatePostModalOpen && (
        <CreatePostModal
          onClose={onCloseCreatePostModal}
          isVisible={isCreatePostModalOpen}
          resetPostsToFirstPage={resetPostsToFirstPage}
        />
      )}
      {isTransferModalOpen && (
        <TransferModal
          address={id}
          onClose={onCloseTransferModal}
          refetchBalance={refetchBalance}
          isVisible={isTransferModalOpen}
        />
      )}
    </div>
  );
};

export default UserHeader;
