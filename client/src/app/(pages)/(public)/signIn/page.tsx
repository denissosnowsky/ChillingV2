import { SignUpStepper } from "@/components/SignUpStepper";
import { WalletNote } from "@/components/WalletNote";

const SignIn = (): JSX.Element => {
  const isConnectedToWallet = false;

  return (
    <main className="page">
      {isConnectedToWallet ? <>SignIn</> : <WalletNote />}
    </main>
  );
};

export default SignIn;
