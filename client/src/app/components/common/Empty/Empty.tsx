type EmptyProps = {
  text: string;
  className?: string;
};

const Empty = ({ text, className }: EmptyProps): JSX.Element => {
  return (
    <div className={`w-full text-black text-3xl text-center ${className}`}>
      {text}
    </div>
  );
};

export default Empty;
