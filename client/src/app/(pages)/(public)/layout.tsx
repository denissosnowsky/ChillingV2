import { Container } from "@/components/common/Container";
import { HeaderPublic } from "@/components/HeaderPublic";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-full">
      <HeaderPublic />
      <Container>{children}</Container>
    </div>
  );
};

export default PublicLayout;
