import { Button } from "@/components/common/Button";

import { StepsFunctions } from "../../types";
import { STEPS } from "../../constants";

type StepLayoutProps = StepsFunctions & {
  children: React.ReactNode;
  description: string;
  currentStep: STEPS;
  disabled?: boolean;
};

const StepLayout = ({
  children,
  onNext,
  onPrev,
  description,
  currentStep,
  disabled,
}: StepLayoutProps): JSX.Element => {
  const isShowingPrevButton = currentStep !== STEPS.FIRST;
  const isLastStep = currentStep === STEPS.FOURTH;
  const nextButtonText = isLastStep ? "Submit" : "Next";
  const nextButtonType = isLastStep ? "submit" : "button";

  return (
    <div className="step">
      <div className="mt-5 mb-3">{description}</div>
      <div className="flex-grow flex justify-center p-7">{children}</div>
      <div className="flex items-center justify-end gap-5">
        {isShowingPrevButton && (
          <Button
            text="Previous"
            color="green"
            theme="colored"
            size="large"
            onClick={onPrev}
          />
        )}
        <Button
          text={nextButtonText}
          color="green"
          theme="colored"
          size="large"
          onClick={onNext}
          type={nextButtonType}
          disabled={!!disabled}
        />
      </div>
    </div>
  );
};

export default StepLayout;
