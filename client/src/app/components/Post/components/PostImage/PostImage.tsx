const PostImage = (): JSX.Element => {
  return (
    <div className="w-full mb-2 rounded-xl overflow-hidden">
      <img
        alt="post"
        src="https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832_640.jpg"
        className="object-contain w-full h-full"
      />
    </div>
  );
};

export default PostImage;
