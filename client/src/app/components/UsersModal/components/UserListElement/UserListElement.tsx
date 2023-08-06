import { useState } from "react";
import { useRouter } from "next/navigation";

import { Avatar } from "@/components/common/Avatar";
import { Button } from "@/components/common/Button";
import { MEDIUM_AVATAR_SIZE } from "@/constants";
import { useFollow, useUnfollow } from "@/api/hooks";

type UserListElementProps = {
  accountAddress: string;
  userAddress: string;
  name: string;
  image: string;
  isSenderFollowing: boolean;
};

const UserListElement = ({
  name,
  image,
  userAddress,
  accountAddress,
  isSenderFollowing: isMeFollowing,
}: UserListElementProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSenderFollowing, setIsSenderFollowing] = useState(isMeFollowing);

  const { push } = useRouter();
  const { followUser } = useFollow(setIsLoading, setIsSenderFollowing);
  const { unfollowUser } = useUnfollow(setIsLoading, setIsSenderFollowing);

  const follow = () => {
    setIsLoading(true);
    followUser(userAddress);
  };

  const unfollow = () => {
    setIsLoading(true);
    unfollowUser(userAddress);
  };

  const navigateToUser = () => {
    push(`/user/${userAddress}`);
  };

  return (
    <div className="w-full h-20 rounded-xl bg-mainOne-light flex items-center justify-between pl-4 pr-4 mb-7">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={navigateToUser}
      >
        <div>
          <Avatar size={MEDIUM_AVATAR_SIZE} src={image.trim()} />
        </div>
        <div>{name}</div>
      </div>
      {accountAddress !== userAddress.toLowerCase() && (
        <div>
          {isSenderFollowing ? (
            <Button
              text="Unfollow"
              theme="colored"
              size="small"
              color="red"
              onClick={unfollow}
              isLoading={isLoading}
            />
          ) : (
            <Button
              text="Follow"
              theme="colored"
              size="small"
              color="blue"
              onClick={follow}
              isLoading={isLoading}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default UserListElement;
