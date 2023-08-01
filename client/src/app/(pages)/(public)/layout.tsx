import { HeaderPublic } from "@/components/HeaderPublic";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-full">
      <HeaderPublic />
      <div className="publicContainer">{children}</div>
    </div>
  );
};

export default PublicLayout;
