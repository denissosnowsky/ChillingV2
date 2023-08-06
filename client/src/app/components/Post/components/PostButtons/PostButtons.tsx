import { ArrowUp } from "@web3uikit/icons";
import { ArrowDown } from "@web3uikit/icons";
import { MessageCircle } from "@web3uikit/icons";
import { Dispatch, SetStateAction, useState } from "react";

import {
  useCancelDislike,
  useCancelLike,
  useDislike,
  useFetchDislikers,
  useFetchLikers,
  useLike,
} from "@/api/hooks";
import { UseFetchUsers } from "@/types";
import { MEDIUM_BUTTON_FONT_SIZE } from "@/constants/common";
import { LittleSpinner } from "@/components/common/LittleSpinner";

type PostButtonsProps = {
  index: BigInt;
  userId: string;
  likesCount: BigInt;
  dislikesCount: BigInt;
  commentsCount: string;
  isLikedBySender: boolean;
  isDislikedBySender: boolean;
  openCommentsModal: Dispatch<SetStateAction<boolean>>;
  setFetchUsersHook: Dispatch<
    SetStateAction<((userId: string, postId: string) => UseFetchUsers) | null>
  >;
  openUsersModalWithHeaderText: Dispatch<
    SetStateAction<"" | "Likers" | "Dislikers">
  >;
};

const PostButtons = ({
  index,
  userId,
  commentsCount,
  openCommentsModal,
  setFetchUsersHook,
  likesCount: likesInitCount,
  dislikesCount: dislikesInitCount,
  isLikedBySender: isLikedBySenderInit,
  isDislikedBySender: isDislikedBySenderInit,
  openUsersModalWithHeaderText,
}: PostButtonsProps): JSX.Element => {
  const [likesCount, setLikesCount] = useState(likesInitCount.toString());
  const [dislikesCount, setDislikesCount] = useState(
    dislikesInitCount.toString()
  );
  const [isLikedBySender, setIsLikedBySender] = useState(isLikedBySenderInit);
  const [isDislikedBySender, setIsDislikedBySender] = useState(
    isDislikedBySenderInit
  );

  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isDislikeLoading, setIsDislikeLoading] = useState(false);

  const onLikeSuccess = () => {
    setLikesCount((prev) => String(Number(prev) + 1));
    setIsLikedBySender(true);
  };
  const onDislikeSuccess = () => {
    setDislikesCount((prev) => String(Number(prev) + 1));
    setIsDislikedBySender(true);
  };
  const onCancelLikeSuccess = () => {
    if (isLikedBySender) {
      setLikesCount((prev) => String(Number(prev) - 1));
      setIsLikedBySender(false);
    }
  };
  const onCancelDisikeSuccess = () => {
    if (isDislikedBySender) {
      setDislikesCount((prev) => String(Number(prev) - 1));
      setIsDislikedBySender(false);
    }
  };

  const { like } = useLike(
    setIsLikeLoading,
    onLikeSuccess,
    onCancelDisikeSuccess
  );
  const { dislike } = useDislike(
    setIsDislikeLoading,
    onDislikeSuccess,
    onCancelLikeSuccess
  );
  const { cancelLike } = useCancelLike(setIsLikeLoading, onCancelLikeSuccess);
  const { cancelDislike } = useCancelDislike(
    setIsDislikeLoading,
    onCancelDisikeSuccess
  );

  const onLike = async () => {
    setIsLikeLoading(true);
    await like(userId, index.toString());
  };
  const onDislike = () => {
    setIsDislikeLoading(true);
    dislike(userId, index.toString());
  };
  const onCancelLike = () => {
    setIsLikeLoading(true);
    cancelLike(userId, index.toString());
  };
  const onCancelDislike = () => {
    setIsDislikeLoading(true);
    cancelDislike(userId, index.toString());
  };

  const arrowUpColor = isLikedBySender
    ? "text-green-700"
    : "text-secondary-light";
  const arrowDownColor = isDislikedBySender
    ? "text-red-600"
    : "text-secondary-light";

  const openLikersModal = () => {
    setFetchUsersHook(() => useFetchLikers);
    openUsersModalWithHeaderText("Likers");
  };
  const openDislikersModal = () => {
    setFetchUsersHook(() => useFetchDislikers);
    openUsersModalWithHeaderText("Dislikers");
  };
  const openCommentModal = () => openCommentsModal(true);

  return (
    <div className="flex gap-3 mt-1">
      <div className={`flex items-center gap-2 ${arrowUpColor}`}>
        <span
          className="cursor-pointer font-semibold"
          onClick={openLikersModal}
        >
          {likesCount}
        </span>
        <div
          className="h-[30px] w-[30px] flex items-center justify-center"
          onClick={isLikedBySender ? onCancelLike : onLike}
        >
          {isLikeLoading ? (
            <LittleSpinner />
          ) : (
            <ArrowUp
              fontSize={MEDIUM_BUTTON_FONT_SIZE}
              className="cursor-pointer"
            />
          )}
        </div>
      </div>
      <div className={`flex items-center gap-2 ${arrowDownColor}`}>
        <span
          className="cursor-pointer font-semibold"
          onClick={openDislikersModal}
        >
          {dislikesCount}
        </span>
        <div
          className="h-[30px] w-[30px] flex items-center justify-center"
          onClick={isDislikedBySender ? onCancelDislike : onDislike}
        >
          {isDislikeLoading ? (
            <LittleSpinner />
          ) : (
            <ArrowDown
              fontSize={MEDIUM_BUTTON_FONT_SIZE}
              className="cursor-pointer"
            />
          )}
        </div>
      </div>
      <div
        className="flex items-center text-secondary-light gap-2 cursor-pointer"
        onClick={openCommentModal}
      >
        <span className="font-semibold">{commentsCount}</span>
        <MessageCircle
          fontSize={MEDIUM_BUTTON_FONT_SIZE}
          onClick={openCommentModal}
        />
      </div>
    </div>
  );
};

export default PostButtons;
