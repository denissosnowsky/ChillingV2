import { Avatar } from "@/components/common/Avatar";
import { Button } from "@/components/common/Button";
import { Empty } from "@/components/common/Empty";
import { MEDIUM_AVATAR_SIZE } from "@/constants";

const UserModalContent = (): JSX.Element => {
  const users = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  const isOwnerFollowing = false;

  return (
    <div className="flex flex-col gap-6 items-center">
      {users.length ? (
        <>
          {users.map((user, index) => (
            <div
              className="w-full h-20 rounded-xl bg-mainOne-light flex items-center justify-between pl-4 pr-4"
              key={index}
            >
              <div className="flex items-center gap-2">
                <div>
                  <Avatar size={MEDIUM_AVATAR_SIZE} />
                </div>
                <div>Denys Sosnovskyi</div>
              </div>
              <div>
                {isOwnerFollowing ? (
                  <Button
                    text="Unfollow"
                    theme="colored"
                    size="small"
                    color="red"
                  />
                ) : (
                  <Button
                    text="Follow"
                    theme="colored"
                    size="small"
                    color="blue"
                  />
                )}
              </div>
            </div>
          ))}
          <Button
            text="Show more"
            theme="colored"
            size="large"
            color="green"
            style={{ marginBottom: 20 }}
          />
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
