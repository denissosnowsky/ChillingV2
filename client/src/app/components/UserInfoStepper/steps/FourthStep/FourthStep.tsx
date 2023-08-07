import Image from "next/image";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { LittleSpinner } from "@/components/common/LittleSpinner";

import { StepLayout } from "../common";
import { DESCRIPTIONS, STEPS } from "../../constants";
import { StepperFormValues, StepsFunctions } from "../../types";

type FourthStepProps = StepsFunctions & {
  currentStep: STEPS;
  isLoading: boolean;
  action: "creation" | "change";
};

const FourthStep = (props: FourthStepProps): JSX.Element => {
  const [preview, setPreview] = useState("");

  const { getValues } = useFormContext<StepperFormValues>();

  const { name, description, photo } = getValues();

  const userImageSize = 120;
  const emptyMessage = "--Empty--";
  const validName = name || emptyMessage;
  const validDescription = description || emptyMessage;
  const stepDescription =
    props.action === "creation" ? DESCRIPTIONS.fourthStep : "";

  useEffect(() => {
    let objectUrl: string;

    if (photo) {
      objectUrl = URL.createObjectURL(photo);
      setPreview(objectUrl);
    }

    return () => photo && URL.revokeObjectURL(objectUrl);
  }, [photo]);

  return (
    <StepLayout {...props} description={stepDescription}>
      <div className="grid grid-cols-[1fr_1fr] grid-rows-[50px_200px_1fr] items-center justify-center h-4/5 gap-x-12 gap-y-5 text-xl">
        <div>Name:</div>
        <div className="overflow-auto">{validName}</div>
        <div>Description:</div>
        <div className="overflow-auto break-all h-[200px] flex items-center justify-center">
          {validDescription}
        </div>
        <div>Photo:</div>
        <div className="justify-self-center">
          {photo ? (
            <>
              {preview ? (
                <Image
                  alt="avatar"
                  src={preview ?? ""}
                  width={userImageSize}
                  height={userImageSize}
                  className="rounded-full"
                />
              ) : (
                <LittleSpinner />
              )}
            </>
          ) : (
            emptyMessage
          )}
        </div>
      </div>
    </StepLayout>
  );
};

export default FourthStep;
