import { Modal } from "@/components/common/Modal";

import { SettingsModalContent } from "./components/SettingsModalContent";

type SettingsModalProps = {
  isVisible: boolean;
  onClose?: () => void;
};

const SettingsModal = ({
  isVisible,
  onClose,
}: SettingsModalProps): JSX.Element => {
  const headerText = "Change user info";
  const modalWidth = "50%";

  return (
    <Modal
      headerText={headerText}
      isVisible={isVisible}
      content={<SettingsModalContent />}
      onCloseButtonPressed={onClose}
      width={modalWidth}
    />
  );
};

export default SettingsModal;
