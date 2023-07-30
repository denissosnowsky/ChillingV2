import Image from "next/image";
import { useFormContext } from "react-hook-form";

import { DESCRIPTIONS, STEPS } from "../../constants";
import { StepperFormValues, StepsFunctions } from "../../types";
import { StepLayout } from "../common";

type FourthStepProps = StepsFunctions & { currentStep: STEPS };

const FourthStep = (props: FourthStepProps): JSX.Element => {
  const { getValues } = useFormContext<StepperFormValues>();

  const { name, description, photo } = getValues();

  const userImageSize = 120;
  const emptyMessage = "--Empty--";
  const validDescription = description || emptyMessage;

  return (
    <StepLayout {...props} description={DESCRIPTIONS.fourthStep}>
      <div className="grid grid-cols-[1fr_1fr] grid-rows-[50px_200px_1fr] items-center justify-center h-4/5 gap-x-12 gap-y-5 text-xl">
        <div>Name:</div>
        <div className="overflow-auto">{name}</div>
        <div>Description:</div>
        <div className="overflow-auto break-all h-[200px] flex items-center justify-center">
          {validDescription}
        </div>
        <div>Photo:</div>
        <div className="justify-self-center">
          {photo ? (
            <Image
              alt="avatar"
              src={photo}
              width={userImageSize}
              height={userImageSize}
            />
          ) : (
            emptyMessage
          )}
        </div>
      </div>
    </StepLayout>
  );
};

export default FourthStep;
