import defaultImage from "@/assets/user.png";
import {
  SMALL_AVATAR_SIZE,
  LARGE_AVATAR_SIZE,
  MEDIUM_AVATAR_SIZE,
} from "@/constants";
import Image from "next/image";

type AvatarProps = {
  size:
    | typeof SMALL_AVATAR_SIZE
    | typeof LARGE_AVATAR_SIZE
    | typeof MEDIUM_AVATAR_SIZE;
  src?: string;
};

const Avatar = ({ size, src }: AvatarProps): JSX.Element => {
  const image = src || defaultImage;

  return (
    <Image
      alt="avatar"
      src={image}
      width={size}
      height={size}
      className="border-2 border-white rounded-full"
    />
  );
};

export default Avatar;
