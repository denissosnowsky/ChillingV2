"use client";

import { Stepper } from "@web3uikit/core";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { stepData } from "./stepData";
import { useStepper } from "./hooks/useStepper";
import { StepperFormValues } from "./types";
import {
  STEPPER_DEFAULT_VALUES,
  STEPPER_FORM_VALIDATION_SCHEMA,
  STEPS,
} from "./constants";

const SignUpStepper = (): JSX.Element => {
  const { startStep, onNext, onPrev, currentStep } = useStepper();

  const methods = useForm<StepperFormValues>({
    defaultValues: STEPPER_DEFAULT_VALUES,
    resolver: yupResolver(STEPPER_FORM_VALIDATION_SCHEMA),
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
          stepData={stepData(currentStep, onNext, onPrev)}
          hasNavButtons={false}
        />
      </form>
    </FormProvider>
  );
};

export default SignUpStepper;
