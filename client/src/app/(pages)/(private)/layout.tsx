"use client";

import { redirect } from "next/navigation";
import { useLayoutEffect } from "react";

import { Container } from "@/components/common/Container";
import { HeaderPrivate } from "@/components/HeaderPrivate";
import { useIsConnectedToWeb3 } from "@/hooks";
import { FullScreenSpinner } from "@/components/common/FullScreenSpinner";

const PrivateLayout = ({ children }: { children: React.ReactNode }) => {
  const { isConnectedToAccount } = useIsConnectedToWeb3();

  useLayoutEffect(() => {
    if (!isConnectedToAccount) redirect("/");
  }, [isConnectedToAccount]);

  return (
    <div className="w-full h-full">
      {isConnectedToAccount ? (
        <>
          <HeaderPrivate />
          <Container>{children}</Container>
        </>
      ) : (
        <FullScreenSpinner />
      )}
    </div>
  );
};

export default PrivateLayout;
