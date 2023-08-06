import { Suspense } from "react";

import { HeaderPublic } from "@/components/HeaderPublic";
import { FullScreenSpinner } from "@/components/common/FullScreenSpinner";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-full">
      <HeaderPublic />

      <div className="publicContainer">
        <Suspense
          fallback={
            <div className="page flex flex-col">
              <FullScreenSpinner className="mb-20" />
            </div>
          }
        >
          {children}
        </Suspense>
      </div>
    </div>
  );
};

export default PublicLayout;
