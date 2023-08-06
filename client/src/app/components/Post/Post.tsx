"use client";

import { useState } from "react";

import { AccountPost, UseFetchUsers } from "@/types";
import { CommentModal } from "@/components/CommentsModal";
import { LikersDislikersModal } from "@/components/LikersDislikersModal";

import { PostText } from "./components/PostText";
import { PostImage } from "./components/PostImage";
import { PostButtons } from "./components/PostButtons";

type PostProps = {
  userId: string;
  post: AccountPost;
  accountAddress: string;
};

const Post = ({
  post: {
    image,
    text,
    index,
    likesCount,
    dislikesCount,
    isLikedBySender,
    isDislikedBySender,
    commentsCount: commentsCountInit,
  },
  userId,
  accountAddress,
}: PostProps): JSX.Element => {
  const [commentsCount, setCommentsCount] = useState(
    commentsCountInit.toString()
  );

  const hasImage = !!image.trim();

  const [userModalHeaderText, setUserModalHeaderText] = useState<
    "Likers" | "Dislikers" | ""
  >("");
  const [fetchUsersHook, setFetchUsersHook] = useState<
    ((userId: string, postId: string) => UseFetchUsers) | null
  >(null);
  const [commentModalOpen, setCommentModalOpen] = useState(false);

  const onCloseUserModal = () => setUserModalHeaderText("");
  const onCloseCommentModal = () => setCommentModalOpen(false);

  return (
    <div className=" text-lg leading-6 mb-20">
      {hasImage && <PostImage image={image} />}
      <PostText text={text} />
      <PostButtons
        index={index}
        userId={userId}
        likesCount={likesCount}
        dislikesCount={dislikesCount}
        commentsCount={commentsCount}
        isLikedBySender={isLikedBySender}
        setFetchUsersHook={setFetchUsersHook}
        isDislikedBySender={isDislikedBySender}
        openCommentsModal={setCommentModalOpen}
        openUsersModalWithHeaderText={setUserModalHeaderText}
      />
      {userModalHeaderText && (
        <LikersDislikersModal
          userId={userId}
          postId={index.toString()}
          who={userModalHeaderText}
          onClose={onCloseUserModal}
          accountAddress={accountAddress}
          useFetchUsers={fetchUsersHook!}
          isVisible={!!userModalHeaderText}
        />
      )}
      {commentModalOpen && (
        <CommentModal
          userId={userId}
          index={index.toString()}
          isVisible={commentModalOpen}
          onClose={onCloseCommentModal}
          setCommentsCount={setCommentsCount}
        />
      )}
    </div>
  );
};

export default Post;
