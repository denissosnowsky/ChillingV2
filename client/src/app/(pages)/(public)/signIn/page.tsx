import { WalletNote } from "@/components/WalletNote";

const SignIn = (): JSX.Element => {
  const isAuthorized = false;

  return (
    <main className="flex flex-col items-center">
      {isAuthorized ? <>SignIn</> : <WalletNote />}
    </main>
  );
};

export default SignIn;
