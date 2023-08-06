"use client";

import { useIsConnectedToWeb3 } from "@/hooks";
import { useStepperQueries } from "@/api/hooks";
import { WalletNote } from "@/components/WalletNote";
import { UserInfoStepper } from "@/components/UserInfoStepper";
import { FullScreenSpinner } from "@/components/common/FullScreenSpinner";

const SignUp = (): JSX.Element => {
  const {
    isConnectedToAccount,
    isWeb3EnableLoading,
    connectToWallet,
    account,
  } = useIsConnectedToWeb3();

  const { signUpQuery, signUpIsLoading } = useStepperQueries(account ?? "");

  return (
    <main className="page flex flex-col pt-7 pb-7">
      {isWeb3EnableLoading ? (
        <FullScreenSpinner className="mb-20" />
      ) : (
        <>
          {isConnectedToAccount ? (
            <UserInfoStepper
              action="creation"
              submitMutation={signUpQuery}
              isSubmitMutationLoading={signUpIsLoading}
            />
          ) : (
            <WalletNote onClick={connectToWallet} />
          )}
        </>
      )}
    </main>
  );
};

export default SignUp;
