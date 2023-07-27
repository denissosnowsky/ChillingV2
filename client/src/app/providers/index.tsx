"use client"

import { MoralisProvider } from "react-moralis";

export const Providers = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => (
  <MoralisProvider initializeOnMount={false}>{children}</MoralisProvider>
);
