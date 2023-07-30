"use client";

import { useEffect } from "react";
import { TextArea } from "@web3uikit/core";
import { useController, useFormContext } from "react-hook-form";

import {
  DESCRIPTIONS,
  STEPPER_FORM_FIELDS,
  STEPPER_FORM_PLACEHOLDERS,
  STEPS,
} from "../../constants";
import { StepperFormValues, StepsFunctions } from "../../types";
import { StepLayout } from "../common";

type SecondStepProps = StepsFunctions & { currentStep: STEPS };

const SecondStep = (props: SecondStepProps): JSX.Element => {
  const { control } = useFormContext<StepperFormValues>();

  const {
    field: { name, value, onChange },
  } = useController({
    control,
    name: STEPPER_FORM_FIELDS.description,
  });

  useEffect(() => {
    // no other way to focus third party library textarea
    const textarea = document.querySelector("textarea");
    textarea?.focus();
  }, []);

  return (
    <StepLayout {...props} description={DESCRIPTIONS.secondStep}>
      <TextArea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={STEPPER_FORM_PLACEHOLDERS.description}
        autoComplete
      />
    </StepLayout>
  );
};

export default SecondStep;
