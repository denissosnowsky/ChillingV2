const Container = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => <div className="container p-5">{children}</div>;

export default Container;
