import { NOTIFICATION_MESSAGES } from "@/constants";
import { useMakeNotification, useMakeQuery } from "@/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";

type UseStepperQueries = {
  signUpQuery: (
    name: string,
    description: string,
    image: string
  ) => Promise<void>;
  signUpIsLoading: boolean;
};

export const useStepperQueries = (account: string): UseStepperQueries => {
  const router = useRouter();

  const [isSigning, setIsSigning] = useState(false);

  const { dispatchError, dispatchTransaction } = useMakeNotification();

  const {
    runContractFunction: signUpContractFunction,
    isFetching: signUpIsFetching,
    isLoading: signUpIsLoading,
  } = useMakeQuery({
    functionName: "signUp",
  });
  
  const signUp = async (name: string, description: string, image: string) => {
    setIsSigning(true);

    await signUpContractFunction({
      params: {
        params: {
          _name: name,
          _description: description.length ? description : " ",
          _image: image.length ? image : " ",
        },
      },
      onError: () => {
        setIsSigning(false);
        dispatchError(NOTIFICATION_MESSAGES.userAlreadySignUp);
        router.push('/');
      },
      onSuccess: async (tx) => {
        await dispatchTransaction(
          NOTIFICATION_MESSAGES.signUpSuccess,
          tx as { wait: Function }
        );
        router.push(`/user/${account}`);
      },
    });
  };

  return {
    signUpQuery: signUp,
    signUpIsLoading: signUpIsFetching || signUpIsLoading || isSigning,
  };
};
