"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";

import { useIsConnectedToWeb3 } from "@/hooks";
import { WalletNote } from "@/components/WalletNote";
import { FullScreenSpinner } from "@/components/common/FullScreenSpinner";

const SignIn = (): JSX.Element => {
  const {
    account,
    connectToWallet,
    isWeb3EnableLoading,
    isConnectedToAccount,
    isAuthenticated,
  } = useIsConnectedToWeb3();

  useEffect(() => {
    if (isConnectedToAccount) {
      redirect(`/user/${account}`);
    }
  }, [isConnectedToAccount, account]);

  const shouldShowLoading =
    isWeb3EnableLoading || isConnectedToAccount || !isAuthenticated;

  return (
    <main className="page flex flex-col pt-7 pb-7">
      {shouldShowLoading ? (
        <FullScreenSpinner className="mb-20" />
      ) : (
        <WalletNote onClick={connectToWallet} />
      )}
    </main>
  );
};

export default SignIn;
