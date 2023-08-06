import { UseFetchUsers } from "@/types";
import { UsersModal } from "../UsersModal";

type LikersDislikersModalProps = {
  userId: string;
  postId: string;
  isVisible: boolean;
  onClose?: () => void;
  accountAddress: string;
  who: "Likers" | "Dislikers" | "";
  useFetchUsers: (userId: string, postId: string) => UseFetchUsers;
};

const LikersDislikersModal = ({
  who,
  userId,
  postId,
  onClose,
  isVisible,
  useFetchUsers,
  accountAddress,
}: LikersDislikersModalProps): JSX.Element => {
  const { data, fetchMore, hasMore, isLoading } = useFetchUsers(userId, postId);

  return (
    <UsersModal
      who={who}
      data={data}
      onClose={onClose}
      hasMore={hasMore}
      fetchMore={fetchMore}
      isLoading={isLoading}
      isVisible={isVisible}
      accountAddress={accountAddress}
    />
  );
};

export default LikersDislikersModal;
