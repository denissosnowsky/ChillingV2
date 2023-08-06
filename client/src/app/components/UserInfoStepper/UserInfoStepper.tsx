"use client";

import { Stepper } from "@web3uikit/core";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { FullScreenSpinner } from "@/components/common/FullScreenSpinner";

import { stepData } from "./stepData";
import { useStepper } from "./hooks";
import { StepperFormValues } from "./types";
import {
  STEPPER_DEFAULT_VALUES,
  STEPPER_FORM_VALIDATION_SCHEMA_WITHOUT_REQUIRED_NAME,
  STEPPER_FORM_VALIDATION_SCHEMA_WITH_REQUIRED_NAME,
  STEPS,
} from "./constants";

type UserInfoStepperProps = {
  action: "creation" | "change";
  isSubmitMutationLoading: boolean;
  submitMutation: (
    name: string,
    description: string,
    image: string
  ) => Promise<void>;
};

const UserInfoStepper = ({
  action,
  submitMutation,
  isSubmitMutationLoading,
}: UserInfoStepperProps): JSX.Element => {
  const isAccountCreation = action === "creation";

  const { startStep, onNext, onPrev, currentStep } = useStepper();

  const validationSchema = isAccountCreation
    ? STEPPER_FORM_VALIDATION_SCHEMA_WITH_REQUIRED_NAME
    : STEPPER_FORM_VALIDATION_SCHEMA_WITHOUT_REQUIRED_NAME;

  const methods = useForm<StepperFormValues>({
    defaultValues: STEPPER_DEFAULT_VALUES,
    resolver: yupResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<StepperFormValues> = async ({
    name,
    description,
    photo,
  }: StepperFormValues) => {
    if (currentStep !== STEPS.FOURTH || isSubmitMutationLoading) return;

    await submitMutation(name, description, photo);
  };

  return (
    <>
      {isSubmitMutationLoading ? (
        <FullScreenSpinner className="mb-20" />
      ) : (
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Stepper
              step={startStep}
              stepData={stepData(currentStep, onNext, onPrev, action, isSubmitMutationLoading)}
              hasNavButtons={false}
            />
          </form>
        </FormProvider>
      )}
    </>
  );
};

export default UserInfoStepper;
