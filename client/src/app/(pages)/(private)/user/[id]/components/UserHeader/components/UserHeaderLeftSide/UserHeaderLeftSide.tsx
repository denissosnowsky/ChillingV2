"use client";

import { Edit } from "@web3uikit/icons";
import { Tokens } from "@web3uikit/icons";

import { Avatar } from "@/components/common/Avatar";
import { Button } from "@/components/common/Button";
import { LARGE_AVATAR_SIZE, SMALL_BUTTON_FONT_SIZE } from "@/constants/common";

type UserHeaderLeftSideProps = {
  isOwner: boolean;
  avatar: string;
  openTransferModal: () => void;
  openCreatePostModal: () => void;
};

const UserHeaderLeftSide = ({
  avatar,
  isOwner,
  openTransferModal,
  openCreatePostModal,
}: UserHeaderLeftSideProps): JSX.Element => {
  return (
    <div className="flex flex-col items-center justify-between w-[210px]">
      <div className="h-[210px] w-[210px]">
        <Avatar size={LARGE_AVATAR_SIZE} src={avatar} />
      </div>
      {isOwner ? (
        <Button
          color="blue"
          size="large"
          theme="colored"
          text="Create Post"
          onClick={openCreatePostModal}
          icon={<Edit fontSize={SMALL_BUTTON_FONT_SIZE} />}
        />
      ) : (
        <Button
          size="large"
          color="yellow"
          text="Transfer"
          theme="colored"
          onClick={openTransferModal}
          icon={<Tokens fontSize={SMALL_BUTTON_FONT_SIZE} />}
        />
      )}
    </div>
  );
};

export default UserHeaderLeftSide;
