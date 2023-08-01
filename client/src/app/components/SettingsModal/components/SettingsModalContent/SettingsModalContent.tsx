import { UserInfoStepper } from "@/components/UserInfoStepper";
import { STEPPER_FORM_VALIDATION_SCHEMA_WITHOUT_REQUIRED_NAME } from "@/components/UserInfoStepper/constants";

const SettingsModalContent = (): JSX.Element => {
  return (
    <div className="mb-10">
      <UserInfoStepper action="change" />
    </div>
  );
};

export default SettingsModalContent;
