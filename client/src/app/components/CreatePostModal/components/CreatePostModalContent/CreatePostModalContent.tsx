import { TextArea, Upload } from "@web3uikit/core";
import { ChangeEvent, useEffect, useState } from "react";

import { useCreatePost } from "@/api/hooks";
import { useUploadImageToIpfs } from "@/hooks";
import { Button } from "@/components/common/Button";
import { FullScreenSpinner } from "@/components/common/FullScreenSpinner";

type CreatePostModalContentProps = {
  onClose?: () => void;
  resetPostsToFirstPage: () => Promise<void>;
};

const CreatePostModalContent = ({
  onClose,
  resetPostsToFirstPage,
}: CreatePostModalContentProps): JSX.Element => {
  const uploadImageToIpfs = useUploadImageToIpfs();

  const [isLoading, setIsLoading] = useState(false);

  const { createPost } = useCreatePost(
    setIsLoading,
    resetPostsToFirstPage,
    onClose
  );

  const uploadConfig = {
    backgroundColor: "transparent",
    height: "10%",
    width: "100%",
  };

  const [text, setText] = useState("");
  const [photo, setPhoto] = useState<Blob | undefined>(undefined);

  const onChangeText = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setText(e.target.value);

  const onChangePhoto = (file?: Blob | null) => {
    setPhoto(file ?? undefined);
  };

  const submitPost = async () => {
    setIsLoading(true);

    const finalImage = !!photo ? await uploadImageToIpfs(photo) : " ";

    await createPost(text, finalImage);
    setText("");
    setPhoto(undefined);
  };

  useEffect(() => {
    // no other way to focus third party library textarea
    const textarea = document.querySelector("textarea");
    textarea?.focus();
  }, []);

  if (isLoading) {
    return (
      <div className="mb-14">
        <FullScreenSpinner />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-2 items-center mb-10">
      <TextArea
        value={text}
        onChange={onChangeText}
        placeholder="Write post..."
        autoComplete
        width="100%"
      />
      <Upload
        onChange={onChangePhoto}
        style={uploadConfig}
        theme="withIcon"
        acceptedFiles="image/png, image/jpeg"
        descriptionText="Only .jpeg or .png files are accepted"
      />
      <Button
        text="Create post"
        theme="colored"
        size="large"
        color="green"
        disabled={!text.length && !photo}
        onClick={submitPost}
      />
    </div>
  );
};

export default CreatePostModalContent;
