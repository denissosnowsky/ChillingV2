"use client";

import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "@web3uikit/core";
import { ThirdwebProvider } from "@thirdweb-dev/react";

import { MoralisAuthWrapper } from "./MoralisAuthWrapper";

export const Providers = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  return (
    <>
      <ThirdwebProvider clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}>
        <MoralisProvider initializeOnMount={false}>
          <NotificationProvider>
            <MoralisAuthWrapper>{children}</MoralisAuthWrapper>
          </NotificationProvider>
        </MoralisProvider>
      </ThirdwebProvider>
    </>
  );
};
