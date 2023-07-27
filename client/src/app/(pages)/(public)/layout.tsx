import { HeaderPublic } from "@/components/HeaderPublic";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-full">
      <HeaderPublic />
      {children}
    </div>
  );
};

export default PublicLayout;
