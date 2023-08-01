"use client";

import { useState } from "react";
import { Input } from "@web3uikit/core";
import { useController, useFormContext } from "react-hook-form";

import {
  DESCRIPTIONS,
  STEPPER_FORM_ERRORS,
  STEPPER_FORM_FIELDS,
  STEPPER_FORM_PLACEHOLDERS,
  STEPS,
} from "../../constants";
import { StepperFormValues, StepsFunctions } from "../../types";
import { StepLayout } from "../common";

type FirstStepProps = StepsFunctions & {
  currentStep: STEPS;
  action: "creation" | "change";
};

const FirstStep = (props: FirstStepProps): JSX.Element => {
  const [isTouched, setiIsTouched] = useState(false);

  const { control } = useFormContext<StepperFormValues>();

  const {
    field: { name, value, onChange },
    fieldState: { isDirty },
  } = useController({
    control,
    name: STEPPER_FORM_FIELDS.name,
  });

  const shouldValidateName = props.action === "creation";
  const stepDescription = shouldValidateName ? DESCRIPTIONS.firstStep : "";
  const isNotValidInput = shouldValidateName && !isDirty && isTouched;
  const inputStyle = { marginTop: 80 };

  const onBlur = () => {
    setiIsTouched(true);
  };

  return (
    <StepLayout
      {...props}
      description={stepDescription}
      disabled={isNotValidInput}
    >
      <Input
        state={isNotValidInput ? "error" : undefined}
        autoComplete
        autoFocus
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={STEPPER_FORM_PLACEHOLDERS.name}
        errorMessage={STEPPER_FORM_ERRORS.name}
        style={inputStyle}
      />
    </StepLayout>
  );
};

export default FirstStep;
