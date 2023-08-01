import { SignUpStepper } from "@/components/UserInfoStepper";
import { WalletNote } from "@/components/WalletNote";

const SignIn = (): JSX.Element => {
  const isConnectedToWallet = false;

  return (
    <main className="page flex flex-col pt-7 pb-7">
      {isConnectedToWallet ? <>SignIn</> : <WalletNote />}
    </main>
  );
};

export default SignIn;
