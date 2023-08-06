import { Dispatch, SetStateAction } from "react";

import { useFetchComments } from "@/api/hooks";
import { Modal } from "@/components/common/Modal";

import { CommentModalContent } from "./components/CommentModalContent";

type CommentModalProps = {
  index: string;
  userId: string;
  isVisible: boolean;
  onClose?: () => void;
  setCommentsCount: Dispatch<SetStateAction<string>>;
};

const CommentModal = ({
  index,
  userId,
  onClose,
  isVisible,
  setCommentsCount
}: CommentModalProps): JSX.Element => {
  const headerText = "Comments";
  const modalWidth = "50%";

  const { data, resetComments, isLoading } = useFetchComments(userId, index);

  return (
    <Modal
      width={modalWidth}
      isVisible={isVisible}
      headerText={headerText}
      content={
        <CommentModalContent
          data={data}
          index={index}
          userId={userId}
          isLoading={isLoading}
          resetComments={resetComments}
          setCommentsCount={setCommentsCount}
        />
      }
      onCloseButtonPressed={onClose}
    />
  );
};

export default CommentModal;
