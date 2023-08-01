import { UserInfoStepper } from "@/components/UserInfoStepper";
import { WalletNote } from "@/components/WalletNote";

const SignUp = (): JSX.Element => {
  const isConnectedToWallet = true;

  return (
    <main className="page h-fit flex flex-col pt-7 pb-7">
      {isConnectedToWallet ? (
        <UserInfoStepper action="creation" />
      ) : (
        <WalletNote />
      )}
    </main>
  );
};

export default SignUp;
