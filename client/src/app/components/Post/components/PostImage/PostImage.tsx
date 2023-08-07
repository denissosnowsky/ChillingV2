import { ipfsURI } from "@/constants";

type PostImageProps = {
  image: string;
};

const PostImage = ({ image }: PostImageProps): JSX.Element => {
  return (
    <div className="w-full mb-2 rounded-xl overflow-hidden">
      <img
        alt="post"
        src={`${ipfsURI}/${image}`}
        className="object-contain w-full h-full"
      />
    </div>
  );
};

export default PostImage;
