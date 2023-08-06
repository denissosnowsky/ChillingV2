type PostTextProps = {
  text: string;
};

const PostText = ({ text }: PostTextProps): JSX.Element => {
  return <div>{text}</div>;
};

export default PostText;
