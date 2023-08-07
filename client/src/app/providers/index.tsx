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
      <ThirdwebProvider clientId="0f32eea6bd0ab52fd3a9177d725e577b">
        <MoralisProvider initializeOnMount={false}>
          <NotificationProvider>
            <MoralisAuthWrapper>{children}</MoralisAuthWrapper>
          </NotificationProvider>
        </MoralisProvider>
      </ThirdwebProvider>
    </>
  );
};
