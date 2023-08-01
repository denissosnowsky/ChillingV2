import { StepsFunctions, SignUpStep } from "./types";
import { FirstStep, SecondStep, ThirdStep, FourthStep } from "./steps";
import { STEPS, TITLES } from "./constants";

export const stepData = (
  currentStep: STEPS,
  onNext: StepsFunctions["onNext"],
  onPrev: StepsFunctions["onPrev"],
  action: "creation" | "change"
): SignUpStep[] => [
  {
    content: (
      <FirstStep
        onNext={onNext}
        onPrev={onPrev}
        key={STEPS.FIRST}
        currentStep={currentStep}
        action={action}
      />
    ),
    title:
      action === "creation" ? TITLES.firstStepCreation : TITLES.firstStepChange,
  },
  {
    content: (
      <SecondStep
        onNext={onNext}
        onPrev={onPrev}
        key={STEPS.SECOND}
        currentStep={currentStep}
        action={action}
      />
    ),
    title:
      action === "creation"
        ? TITLES.secondStepCreation
        : TITLES.secondStepChange,
  },
  {
    content: (
      <ThirdStep
        onNext={onNext}
        onPrev={onPrev}
        key={STEPS.THIRD}
        currentStep={currentStep}
        action={action}
      />
    ),
    title:
      action === "creation" ? TITLES.thirdStepCreation : TITLES.thirdStepChange,
  },
  {
    content: (
      <FourthStep
        onNext={onNext}
        onPrev={onPrev}
        key={STEPS.FOURTH}
        currentStep={currentStep}
        action={action}
      />
    ),
    title: TITLES.fourthStep,
  },
];
