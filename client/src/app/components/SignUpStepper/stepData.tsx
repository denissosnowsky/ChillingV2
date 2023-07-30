import { StepsFunctions, SignUpStep } from "./types";
import { FirstStep, SecondStep, ThirdStep, FourthStep } from "./steps";
import { STEPS } from "./constants";

export const stepData = (
  currentStep: STEPS,
  onNext: StepsFunctions["onNext"],
  onPrev: StepsFunctions["onPrev"]
): SignUpStep[] => [
  {
    content: <FirstStep onNext={onNext} onPrev={onPrev} key={STEPS.FIRST} currentStep={currentStep} />,
    title: "Fill in your name",
  },
  {
    content: <SecondStep onNext={onNext} onPrev={onPrev} key={STEPS.SECOND} currentStep={currentStep} />,
    title: "Fill in your description or status",
  },
  {
    content: <ThirdStep onNext={onNext} onPrev={onPrev} key={STEPS.THIRD} currentStep={currentStep} />,
    title: "Choose your photo",
  },
  {
    content: <FourthStep onNext={onNext} onPrev={onPrev} key={STEPS.FOURTH} currentStep={currentStep} />,
    title: "Review and Submit",
  },
];
