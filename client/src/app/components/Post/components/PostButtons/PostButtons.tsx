import { Dispatch, SetStateAction } from "react";
import { ArrowUp } from "@web3uikit/icons";
import { ArrowDown } from "@web3uikit/icons";
import { MessageCircle } from "@web3uikit/icons";

import { MEDIUM_BUTTON_FONT_SIZE } from "@/constants";

type PostButtonsProps = {
  openUsersModalWithHeaderText: Dispatch<SetStateAction<string>>;
  openCommentsModal: Dispatch<SetStateAction<boolean>>;
};

const PostButtons = ({
  openUsersModalWithHeaderText,
  openCommentsModal,
}: PostButtonsProps): JSX.Element => {
  const isOwnerLiked = false;
  const isOwnerDisliked = false;
  const arrowUpColor = isOwnerLiked ? "text-green-700" : "text-secondary-light";
  const arrowDownColor = isOwnerDisliked
    ? "text-red-600"
    : "text-secondary-light";

  const openLikersModal = () => openUsersModalWithHeaderText("Likers");
  const openDislikersModal = () => openUsersModalWithHeaderText("Dislikers");
  const openCommentModal = () => openCommentsModal(true);

  return (
    <div className="flex gap-3 mt-1">
      <div className={`flex items-center gap-2 ${arrowUpColor}`}>
        <span
          className="cursor-pointer font-semibold"
          onClick={openLikersModal}
        >
          122
        </span>
        <ArrowUp
          fontSize={MEDIUM_BUTTON_FONT_SIZE}
          className="cursor-pointer"
        />
      </div>
      <div className={`flex items-center gap-2 ${arrowDownColor}`}>
        <span
          className="cursor-pointer font-semibold"
          onClick={openDislikersModal}
        >
          122
        </span>
        <ArrowDown
          fontSize={MEDIUM_BUTTON_FONT_SIZE}
          className="cursor-pointer"
        />
      </div>
      <div
        className="flex items-center text-secondary-light gap-2 cursor-pointer"
        onClick={openCommentModal}
      >
        <span className="font-semibold">12</span>
        <MessageCircle
          fontSize={MEDIUM_BUTTON_FONT_SIZE}
          onClick={openCommentModal}
        />
      </div>
    </div>
  );
};

export default PostButtons;
