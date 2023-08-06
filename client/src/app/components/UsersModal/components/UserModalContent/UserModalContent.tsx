import { Empty } from "@/components/common/Empty";
import { Button } from "@/components/common/Button";
import { FullScreenSpinner } from "@/components/common/FullScreenSpinner";
import { UserAccountShort } from "@/types";

import UserListElement from "../UserListElement/UserListElement";

type UserModalContentProps = {
  hasMore: boolean;
  isLoading: boolean;
  accountAddress: string;
  data: UserAccountShort[];
  fetchMore: () => Promise<void>;
};

const UserModalContent = ({
  data,
  hasMore,
  isLoading,
  fetchMore,
  accountAddress,
}: UserModalContentProps): JSX.Element => {
  if (isLoading) {
    return (
      <div className="flex flex-col">
        <FullScreenSpinner className="mb-20" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {data.length ? (
        <>
          {data.map(
            ({
              accountAddress: userAddress,
              name,
              image,
              isSenderFollowing,
            }) => (
              <UserListElement
                name={name}
                image={image}
                key={userAddress}
                userAddress={userAddress}
                accountAddress={accountAddress}
                isSenderFollowing={isSenderFollowing}
              />
            )
          )}
          {hasMore && (
            <Button
              text="Show more"
              theme="colored"
              size="large"
              color="green"
              style={{ marginBottom: 20 }}
              onClick={fetchMore}
            />
          )}
        </>
      ) : (
        <div>
          <Empty text="No users" className="mb-12" />
        </div>
      )}
    </div>
  );
};

export default UserModalContent;
