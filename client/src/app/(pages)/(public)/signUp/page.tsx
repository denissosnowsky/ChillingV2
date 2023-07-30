import { SignUpStepper } from "@/components/SignUpStepper";
import { WalletNote } from "@/components/WalletNote";

const SignUp = (): JSX.Element => {
  const isConnectedToWallet = true;

  return (
    <main className="page h-fit">
      {isConnectedToWallet ? <SignUpStepper /> : <WalletNote />}
    </main>
  );
};

export default SignUp;
