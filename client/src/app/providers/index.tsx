"use client";

import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "@web3uikit/core";

import { MoralisAuthWrapper } from "./MoralisAuthWrapper";

export const Providers = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  return (
    <>
      <MoralisProvider initializeOnMount={false}>
        <NotificationProvider>
          <MoralisAuthWrapper>{children}</MoralisAuthWrapper>
        </NotificationProvider>
      </MoralisProvider>
    </>
  );
};
