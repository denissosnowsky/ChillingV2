import { UserAccountShort } from "@/types";
import { Modal } from "@/components/common/Modal";

import { UserModalContent } from "./components/UserModalContent";

type UsersModalProps = {
  hasMore: boolean;
  isVisible: boolean;
  isLoading: boolean;
  onClose?: () => void;
  accountAddress: string;
  data: UserAccountShort[];
  fetchMore: () => Promise<void>;
  who: "Followers" | "Followings" | "Likers" | "Dislikers" | "";
};

const UsersModal = ({
  who,
  data,
  hasMore,
  onClose,
  fetchMore,
  isLoading,
  isVisible,
  accountAddress,
}: UsersModalProps): JSX.Element => {
  const modalWidth = "50%";
  const headerText = `${who}: ${data.length}`;

  return (
    <Modal
      width={modalWidth}
      isVisible={isVisible}
      headerText={headerText}
      content={
        <UserModalContent
          data={data}
          hasMore={hasMore}
          isLoading={isLoading}
          fetchMore={fetchMore}
          accountAddress={accountAddress}
        />
      }
      onCloseButtonPressed={onClose}
    />
  );
};

export default UsersModal;
