import { useCallback, useMemo, useState } from "react";

import { STEPS } from "../constants";
import { StepsFunctions } from "../types";

export const useStepper = (): StepsFunctions & {
  startStep: number;
  currentStep: STEPS;
} => {
  const [step, setStep] = useState(STEPS.FIRST);

  const nextEvent = useMemo(() => new Event("next", { bubbles: true }), []);
  const prevEvent = useMemo(() => new Event("prev", { bubbles: true }), []);

  const onNext = useCallback(() => {
    const hasNext = step < STEPS.FOURTH;

    if (hasNext) {
      const isSuccess = document.dispatchEvent(nextEvent);

      if (isSuccess) {
        setStep((prevStep) => prevStep + 1);
      }
    }
  }, [nextEvent, step]);

  const onPrev = useCallback(() => {
    const hasPrev = step > STEPS.FIRST;

    if (hasPrev) {
      const isSuccess = document.dispatchEvent(prevEvent);

      if (isSuccess) {
        setStep((prevStep) => prevStep - 1);
      }
    }
  }, [prevEvent, step]);

  return {
    onNext,
    onPrev,
    currentStep: step,
    startStep: STEPS.FIRST,
  };
};
