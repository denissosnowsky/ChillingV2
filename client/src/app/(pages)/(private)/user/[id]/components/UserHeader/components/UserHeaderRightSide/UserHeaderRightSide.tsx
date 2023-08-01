import { Dispatch, SetStateAction } from "react";
import { Cog } from "@web3uikit/icons";

import { Button } from "@/components/common/Button";
import { MEDIUM_BUTTON_FONT_SIZE } from "@/constants";

type UserHeaderRightSide = {
  isOwner: boolean;
  isFollowing: boolean;
  openUserModalWithHeaderText: Dispatch<SetStateAction<string>>;
  openSettingsModal: () => void;
};

const UserHeaderRightSide = ({
  isOwner,
  isFollowing,
  openSettingsModal,
  openUserModalWithHeaderText,
}: UserHeaderRightSide): JSX.Element => {
  const openFollowersModal = () => {
    openUserModalWithHeaderText("Followers");
  };

  const openFollowingsModal = () => {
    openUserModalWithHeaderText("Followings");
  };

  return (
    <div className="flex flex-col justify-between">
      <div className=" flex flex-col h-[210px]">
        <div className="font-bold text-3xl mb-5 flex gap-3">
          <span>Denys Sosnovskyi</span>
          {!isOwner && isFollowing && (
            <Button text="Unfollow" theme="colored" size="small" color="red" />
          )}
          {!isOwner && !isFollowing && (
            <Button text="Follow" theme="colored" size="small" color="blue" />
          )}
        </div>
        <div className="text-lg overflow-auto">
          Description - I am a software developer. Helloo, I am learning
          blockchain, Solidity, Ethereum, JavaScript, React.
        </div>
      </div>
      <div className="flex items-center justify-around">
        <Button
          color="green"
          text="0 Followers"
          size="large"
          theme="colored"
          onClick={openFollowersModal}
        />
        <Button
          color="green"
          text="0 Followings"
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
