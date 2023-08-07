"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  useMakeNotification,
  useMakeQuery,
  useUploadImageToIpfs,
} from "@/hooks";
import { NOTIFICATION_MESSAGES } from "@/constants";

type UseStepperQueries = {
  signUpQuery: (
    name: string,
    description: string,
    image: Blob | undefined
  ) => Promise<void>;
  signUpIsLoading: boolean;
};

export const useStepperQueries = (account: string): UseStepperQueries => {
  const router = useRouter();

  const uploadImageToIpfs = useUploadImageToIpfs();

  const [isSigning, setIsSigning] = useState(false);

  const { dispatchError, dispatchTransaction } = useMakeNotification();

  const {
    runContractFunction: signUpContractFunction,
    isFetching: signUpIsFetching,
    isLoading: signUpIsLoading,
  } = useMakeQuery({
    functionName: "signUp",
  });

  const signUp = async (
    name: string,
    description: string,
    image: Blob | undefined
  ) => {
    setIsSigning(true);

    const finalImage = !!image ? await uploadImageToIpfs(image) : " ";

    await signUpContractFunction({
      params: {
        params: {
          _name: name,
          _description: description.length ? description : " ",
          _image: finalImage,
        },
      },
      onError: () => {
        setIsSigning(false);
        dispatchError(NOTIFICATION_MESSAGES.userAlreadySignUp);
        router.push("/");
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
