import { Dispatch, SetStateAction, useState } from "react";

import { UserInfoStepper } from "@/components/UserInfoStepper";
import {
  useChangeDescription,
  useChangeImage,
  useChangeName,
} from "@/api/hooks";

type SettingsModalContentProps = {
  onClose?: () => void;
  setName: Dispatch<SetStateAction<string>>;
  setImage: Dispatch<SetStateAction<string>>;
  setDescription: Dispatch<SetStateAction<string>>;
};

const SettingsModalContent = ({
  setName,
  onClose,
  setImage,
  setDescription,
}: SettingsModalContentProps): JSX.Element => {
  const [isChangeNameLoading, setIsChangeNameLoading] = useState(false);
  const [isChangeImageLoading, setIsChangeImageLoading] = useState(false);
  const [isChangeDescriptionLoading, setIsChangeDescriptionLoading] =
    useState(false);

  const isLoading =
    isChangeNameLoading || isChangeImageLoading || isChangeDescriptionLoading;

  const { changeUserName } = useChangeName(
    setIsChangeNameLoading,
    (name: string) => setName(name)
  );
  const { changeUserImage } = useChangeImage(
    setIsChangeImageLoading,
    (image: string) => setImage(image)
  );
  const { changeUserDescription } = useChangeDescription(
    setIsChangeDescriptionLoading,
    (description: string) => setDescription(description)
  );

  const submitChange = async (
    name: string,
    description: string,
    image: Blob | undefined
  ) => {
    if (name) {
      setIsChangeNameLoading(true);
      await changeUserName(name);
    }
    if (description) {
      setIsChangeDescriptionLoading(true);
      await changeUserDescription(description);
    }
    if (image) {
      setIsChangeImageLoading(true);
      await changeUserImage(image);
    }
    if (onClose) onClose();
  };

  return (
    <div className="mb-10">
      <UserInfoStepper
        action="change"
        isSubmitMutationLoading={isLoading}
        submitMutation={submitChange}
      />
    </div>
  );
};

export default SettingsModalContent;
