"use client";

import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { TextArea } from "@web3uikit/core";

import { Comment } from "@/types";
import { Empty } from "@/components/common/Empty";
import { Avatar } from "@/components/common/Avatar";
import { Button } from "@/components/common/Button";
import { SMALL_AVATAR_SIZE } from "@/constants/common";
import { FullScreenSpinner } from "@/components/common/FullScreenSpinner";
import { useCreateComment } from "@/api/hooks";

type CommentModalContentProps = {
  index: string;
  userId: string;
  data: Comment[];
  isLoading: boolean;
  resetComments: () => Promise<void>;
  setCommentsCount: Dispatch<SetStateAction<string>>;
};

const CommentModalContent = ({
  data,
  index,
  userId,
  isLoading,
  resetComments,
  setCommentsCount,
}: CommentModalContentProps): JSX.Element => {
  const [isCommentCreateLoading, setIsCommentCreateLoading] = useState(false);
  const [commentText, setCommentText] = useState("");

  const onCommentCreate = () => {
    setCommentsCount((prev) => String(Number(prev) + 1));
  };

  const { createPostComment } = useCreateComment(
    setIsCommentCreateLoading,
    resetComments,
    onCommentCreate
  );

  useEffect(() => {
    // no other way to focus third party library textarea
    const textarea = document.querySelector("textarea");
    textarea?.focus();
  }, []);

  const onChangeComment = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setCommentText(e.target.value);

  const onCreateComment = async () => {
    setCommentText("");
    setIsCommentCreateLoading(true);
    await createPostComment(commentText, userId, index);
  };

  if (isLoading || isCommentCreateLoading) {
    return (
      <div className="flex flex-col">
        <FullScreenSpinner className="mb-20" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex flex-col gap-2 items-center mb-10">
        <TextArea
          width="100%"
          autoComplete
          value={commentText}
          onChange={onChangeComment}
          placeholder="Write comment..."
        />
        <Button
          size="large"
          color="green"
          theme="colored"
          text="Send comment"
          onClick={onCreateComment}
          disabled={!commentText.length}
        />
      </div>
      {data.length ? (
        <>
          {data.map(({ image, name, text }, index) => (
            <div key={index} className="flex flex-col mb-10 w-full">
              <div className="flex gap-2 items-center">
                <div>
                  <Avatar size={SMALL_AVATAR_SIZE} src={image.trim()} />
                </div>
                <div>{name}</div>
              </div>
              <div className=" text-base leading-6">{text}</div>
            </div>
          ))}
        </>
      ) : (
        <div>
          <Empty text="No comments" className="mb-12" />
        </div>
      )}
    </div>
  );
};

export default CommentModalContent;
