const Container = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => <div className="container pr-5 pl-5">{children}</div>;

export default Container;
