import { Modal } from "@/components/common/Modal";

import { CommentModalContent } from "./components/CommentModalContent";

type CommentModalProps = {
  isVisible: boolean;
  onClose?: () => void;
};

const CommentModal = ({
  isVisible,
  onClose,
}: CommentModalProps): JSX.Element => {
  const headerText = "Comments";
  const modalWidth = "50%";

  return (
    <Modal
      headerText={headerText}
      isVisible={isVisible}
      content={<CommentModalContent />}
      onCloseButtonPressed={onClose}
      width={modalWidth}
    />
  );
};

export default CommentModal;
