import { Modal } from "@/components/common/Modal";

import { CreatePostModalContent } from "./components/CreatePostModalContent";

type CreatePostModalProps = {
  isVisible: boolean;
  onClose?: () => void;
  resetPostsToFirstPage: () => Promise<void>;
};

const CreatePostModal = ({
  onClose,
  isVisible,
  resetPostsToFirstPage,
}: CreatePostModalProps): JSX.Element => {
  const headerText = "Create post";
  const modalWidth = "50%";

  return (
    <Modal
      headerText={headerText}
      isVisible={isVisible}
      content={
        <CreatePostModalContent
          onClose={onClose}
          resetPostsToFirstPage={resetPostsToFirstPage}
        />
      }
      onCloseButtonPressed={onClose}
      width={modalWidth}
    />
  );
};

export default CreatePostModal;
