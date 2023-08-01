"use client";

import { useLayoutEffect } from "react";
import { redirect } from "next/navigation";

import { WalletNote } from "@/components/WalletNote";
import { FullScreenSpinner } from "@/components/common/FullScreenSpinner";
import { useIsConnectedToWeb3 } from "@/hooks";

const SignIn = (): JSX.Element => {
  const { isConnectedToAccount, isWeb3EnableLoading, connectToWallet } =
    useIsConnectedToWeb3();

  useLayoutEffect(() => {
    if (isConnectedToAccount) {
      redirect("/user/1");
    }
  }, [isConnectedToAccount]);

  return (
    <main className="page flex flex-col pt-7 pb-7">
      {isWeb3EnableLoading ? (
        <FullScreenSpinner className="mb-20" />
      ) : (
        <>{!isConnectedToAccount && <WalletNote onClick={connectToWallet} />}</>
      )}
    </main>
  );
};

export default SignIn;
