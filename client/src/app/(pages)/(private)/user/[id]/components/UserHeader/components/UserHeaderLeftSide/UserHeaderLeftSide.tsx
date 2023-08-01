import { Edit } from "@web3uikit/icons";
import { Tokens } from "@web3uikit/icons";

import { Avatar } from "@/components/common/Avatar";
import { Button } from "@/components/common/Button";
import { LARGE_AVATAR_SIZE, SMALL_BUTTON_FONT_SIZE } from "@/constants";

type UserHeaderLeftSideProps = {
  isOwner: boolean;
};

const UserHeaderLeftSide = ({
  isOwner,
}: UserHeaderLeftSideProps): JSX.Element => {
  return (
    <div className="flex flex-col items-center justify-between w-[210px]">
      <Avatar size={LARGE_AVATAR_SIZE} />
      {isOwner ? (
        <Button
          text="Create Post"
          color="blue"
          theme="colored"
          size="large"
          icon={<Edit fontSize={SMALL_BUTTON_FONT_SIZE} />}
        />
      ) : (
        <Button
          text="Transfer"
          color="yellow"
          theme="colored"
          size="large"
          icon={<Tokens fontSize={SMALL_BUTTON_FONT_SIZE} />}
        />
      )}
    </div>
  );
};

export default UserHeaderLeftSide;
