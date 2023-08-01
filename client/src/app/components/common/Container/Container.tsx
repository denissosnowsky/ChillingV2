const Container = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => <div className="privateContainer">{children}</div>;

export default Container;
