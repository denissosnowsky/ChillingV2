import { Modal } from "@/components/common/Modal";

import { TransferModalContent } from "./components/TransferModalContent";

type CommentModalProps = {
  address: string;
  isVisible: boolean;
  onClose?: () => void;
  refetchBalance: () => void;
};

const TransferModal = ({
  address,
  onClose,
  isVisible,
  refetchBalance,
}: CommentModalProps): JSX.Element => {
  const modalWidth = "50%";
  const headerText = "Transfer";

  return (
    <Modal
      width={modalWidth}
      isVisible={isVisible}
      headerText={headerText}
      onCloseButtonPressed={onClose}
      content={
        <TransferModalContent
          address={address}
          onClose={onClose}
          refetchBalance={refetchBalance}
        />
      }
    />
  );
};

export default TransferModal;
