import { StepperProps } from "@web3uikit/core";

export type SignUpStep = StepperProps["stepData"][number];

export type StepsFunctions = {
  onNext: () => void;
  onPrev: () => void;
};

export type StepperFormValues = {
  name: string;
  description: string;
  photo: Blob | undefined;
};
