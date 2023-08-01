"use client";

import { MoralisProvider } from "react-moralis";

import { MoralisAuthWrapper } from "./MoralisAuthWrapper";

export const Providers = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  return (
    <>
      <MoralisProvider initializeOnMount={false}>
        <MoralisAuthWrapper>{children}</MoralisAuthWrapper>
      </MoralisProvider>
    </>
  );
};
