import { UseFetchUsers } from "@/types";
import { UsersModal } from "../UsersModal";

type FollowersFollowingsModalProps = {
  id: string;
  isVisible: boolean;
  accountAddress: string;
  onClose?: () => void;
  who: "Followers" | "Followings" | "";
  useFetchUsers: (id: string) => UseFetchUsers;
};

const FollowersFollowingsModal = ({
  id,
  who,
  onClose,
  isVisible,
  useFetchUsers,
  accountAddress,
}: FollowersFollowingsModalProps): JSX.Element => {
  const { data, fetchMore, hasMore, isLoading } = useFetchUsers(id);

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

export default FollowersFollowingsModal;
