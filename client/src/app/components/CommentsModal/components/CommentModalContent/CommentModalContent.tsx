"use client";

import { TextArea } from "@web3uikit/core";

import { Avatar } from "@/components/common/Avatar";
import { Button } from "@/components/common/Button";
import { Empty } from "@/components/common/Empty";
import { SMALL_AVATAR_SIZE } from "@/constants";
import { ChangeEvent, useEffect, useState } from "react";

const CommentModalContent = (): JSX.Element => {
  const posts = [1, 2, 2, 2, 2];

  const [comment, setComment] = useState("");

  const onChangeComment = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setComment(e.target.value);

  useEffect(() => {
    // no other way to focus third party library textarea
    const textarea = document.querySelector("textarea");
    textarea?.focus();
    console.log(textarea);
  }, []);

  return (
    <div className="flex flex-col gap-10 items-center">
      <div className="w-full flex flex-col gap-2 items-center">
        <TextArea
          value={comment}
          onChange={onChangeComment}
          placeholder="Write comment..."
          autoComplete
          width="100%"
        />
        <Button
          text="Send comment"
          theme="colored"
          size="large"
          color="green"
          disabled={!comment.length}
        />
      </div>
      {posts.length ? (
        <>
          {posts.map((el, index) => (
            <div key={index} className="flex flex-col">
              <div className="flex gap-2 items-center">
                <div>
                  <Avatar size={SMALL_AVATAR_SIZE} />
                </div>
                <div>Denys Sosnovskyi</div>
              </div>
              <div className=" text-base leading-6">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industrys standard dummy text
                ever since the 1500s, when an unknown printer took a galley of
                type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
              </div>
            </div>
          ))}
          <Button
            text="Show more"
            theme="colored"
            size="large"
            color="green"
            style={{ marginBottom: 20 }}
          />
        </>
      ) : (
        <div>
          <Empty text="No users" className="mb-12" />
        </div>
      )}
    </div>
  );
};

export default CommentModalContent;
