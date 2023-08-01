"use client";

import { useState } from "react";

import { UsersModal } from "@/components/UsersModal";
import { SettingsModal } from "@/components/SettingsModal";

import { UserHeaderLeftSide } from "./components/UserHeaderLeftSide";
import { UserHeaderRightSide } from "./components/UserHeaderRightSide";

type UserHeaderProps = {};

const UserHeader = ({}: UserHeaderProps): JSX.Element => {
  const isOwner = false;
  const isFollowing = false;

  const [userModalHeaderText, setUserModalHeaderText] = useState("");
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const onCloseUserModal = () => setUserModalHeaderText("");
  const onCloseSettinsModal = () => setIsSettingsModalOpen(false);
  const openSettingsModal = () => setIsSettingsModalOpen(true);

  return (
    <div className="w-full h-[270px] grid grid-cols-[1fr_2fr] gap-10">
      <UserHeaderLeftSide isOwner={isOwner} />
      <UserHeaderRightSide
        isOwner={isOwner}
        isFollowing={isFollowing}
        openUserModalWithHeaderText={setUserModalHeaderText}
        openSettingsModal={openSettingsModal}
      />
      <UsersModal
        who={userModalHeaderText}
        isVisible={!!userModalHeaderText}
        onClose={onCloseUserModal}
      />
      <SettingsModal
        isVisible={isSettingsModalOpen}
        onClose={onCloseSettinsModal}
      />
    </div>
  );
};

export default UserHeader;
