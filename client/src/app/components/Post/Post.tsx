"use client";

import { useState } from "react";

import { UsersModal } from "@/components/UsersModal";
import { CommentModal } from "@/components/CommentsModal";

import { PostText } from "./components/PostText";
import { PostImage } from "./components/PostImage";
import PostButtons from "./components/PostButtons/PostButtons";

const Post = (): JSX.Element => {
  const hasImage = false;

  const [userModalHeaderText, setUserModalHeaderText] = useState("");
  const [commentModalOpen, setCommentModalOpen] = useState(false);

  const onCloseUserModal = () => setUserModalHeaderText("");
  const onCloseCommentModal = () => setCommentModalOpen(false);

  return (
    <div className=" text-lg leading-6">
      {hasImage && <PostImage />}
      <PostText />
      <PostButtons
        openUsersModalWithHeaderText={setUserModalHeaderText}
        openCommentsModal={setCommentModalOpen}
      />
      <UsersModal
        who={userModalHeaderText}
        isVisible={!!userModalHeaderText}
        onClose={onCloseUserModal}
      />
      <CommentModal
        isVisible={commentModalOpen}
        onClose={onCloseCommentModal}
      />
    </div>
  );
};

export default Post;
