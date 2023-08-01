"use client";

import { AnyObject, ObjectSchema } from "yup";
import { Stepper } from "@web3uikit/core";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { stepData } from "./stepData";
import { useStepper } from "./hooks/useStepper";
import { StepperFormValues } from "./types";
import {
  STEPPER_DEFAULT_VALUES,
  STEPPER_FORM_VALIDATION_SCHEMA_WITHOUT_REQUIRED_NAME,
  STEPPER_FORM_VALIDATION_SCHEMA_WITH_REQUIRED_NAME,
  STEPS,
} from "./constants";

type UserInfoStepperProps = {
  action: "creation" | "change";
};

const UserInfoStepper = ({ action }: UserInfoStepperProps): JSX.Element => {
  const { startStep, onNext, onPrev, currentStep } = useStepper();

  const validationSchema =
    action === "creation"
      ? STEPPER_FORM_VALIDATION_SCHEMA_WITH_REQUIRED_NAME
      : STEPPER_FORM_VALIDATION_SCHEMA_WITHOUT_REQUIRED_NAME;

  const methods = useForm<StepperFormValues>({
    defaultValues: STEPPER_DEFAULT_VALUES,
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = () => {
    if (currentStep === STEPS.FOURTH) {
      alert("Yo");
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Stepper
          step={startStep}
          stepData={stepData(currentStep, onNext, onPrev, action)}
          hasNavButtons={false}
        />
      </form>
    </FormProvider>
  );
};

export default UserInfoStepper;
