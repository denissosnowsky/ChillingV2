"use client";

import { BalanceProvider } from "@/contexts";
import { Container } from "@/components/common/Container";
import { useUserAuth, useFetchBalance } from "@/api/hooks";
import { HeaderPrivate } from "@/components/HeaderPrivate";
import { FullScreenSpinner } from "@/components/common/FullScreenSpinner";

const PrivateLayout = ({ children }: { children: React.ReactNode }) => {
  const { address, shouldShowLoading, data } = useUserAuth();

  return (
    <BalanceProvider>
      <div className="w-full h-full">
        {shouldShowLoading ? (
          <FullScreenSpinner />
        ) : (
          <>
            <HeaderPrivate address={address} image={data?.image.trim() ?? ""} />
            <Container>{children}</Container>
          </>
        )}
      </div>
    </BalanceProvider>
  );
};

export default PrivateLayout;
