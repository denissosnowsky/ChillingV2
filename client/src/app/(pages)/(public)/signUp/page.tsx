import { WalletNote } from "@/components/WalletNote";

const SignUp = (): JSX.Element => {
  const isAuthorized = false;

  return (
    <main className="flex flex-col items-center">
      {isAuthorized ? <>SignUp</> : <WalletNote />}
    </main>
  );
};

export default SignUp;
