import { Upload } from "@web3uikit/core";
import { useController, useFormContext } from "react-hook-form";

import { DESCRIPTIONS, STEPPER_FORM_FIELDS, STEPS } from "../../constants";
import { StepperFormValues, StepsFunctions } from "../../types";
import { StepLayout } from "../common";

type ThirdStepProps = StepsFunctions & {
  currentStep: STEPS;
  action: "creation" | "change";
};

const ThirdStep = (props: ThirdStepProps): JSX.Element => {
  const { setValue } = useFormContext<StepperFormValues>();

  const stepDescription =
    props.action === "creation" ? DESCRIPTIONS.thirdStep : "";
  const uploadConfig = {
    backgroundColor: "transparent",
    height: "70%",
    width: "50%",
  };

  const choosePhoto = (file?: Blob | null) => {
    // TODO: replace with real photo
    setValue(STEPPER_FORM_FIELDS.photo, "");
  };

  return (
    <StepLayout {...props} description={stepDescription}>
      <Upload
        onChange={choosePhoto}
        style={uploadConfig}
        theme="withIcon"
        acceptedFiles="image/png, image/jpeg"
        descriptionText="Only .jpeg or .png files are accepted"
      />
    </StepLayout>
  );
};

export default ThirdStep;
