import { Container } from "@/components/common/Container";
import { HeaderPrivate } from "@/components/HeaderPrivate";

const PrivateLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-full">
      <HeaderPrivate />
      <Container>{children}</Container>
    </div>
  );
};

export default PrivateLayout;
