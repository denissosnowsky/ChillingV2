import { Modal } from "@/components/common/Modal";

import { UserModalContent } from "./components/UserModalContent";

type UsersModalProps = {
  who: string;
  isVisible: boolean;
  onClose?: () => void;
};

const UsersModal = ({
  isVisible,
  who,
  onClose,
}: UsersModalProps): JSX.Element => {
  const modalWidth = "50%";
  const headerText = `${who}: ${0}`;

  return (
    <Modal
      headerText={headerText}
      isVisible={isVisible}
      content={<UserModalContent />}
      onCloseButtonPressed={onClose}
      width={modalWidth}
    />
  );
};

export default UsersModal;
