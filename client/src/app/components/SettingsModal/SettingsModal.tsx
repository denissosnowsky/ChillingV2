import { Modal } from "@/components/common/Modal";

import { SettingsModalContent } from "./components/SettingsModalContent";
import { Dispatch, SetStateAction } from "react";

type SettingsModalProps = {
  isVisible: boolean;
  onClose?: () => void;
  setName: Dispatch<SetStateAction<string>>;
  setImage: Dispatch<SetStateAction<string>>;
  setDescription: Dispatch<SetStateAction<string>>;
};

const SettingsModal = ({
  setName,
  onClose,
  setImage,
  isVisible,
  setDescription,
}: SettingsModalProps): JSX.Element => {
  const headerText = "Change user info";
  const modalWidth = "50%";

  return (
    <Modal
      headerText={headerText}
      isVisible={isVisible}
      content={
        <SettingsModalContent
          onClose={onClose}
          setName={setName}
          setImage={setImage}
          setDescription={setDescription}
        />
      }
      onCloseButtonPressed={onClose}
      width={modalWidth}
    />
  );
};

export default SettingsModal;
