import { SMALL_SPINNER } from "@/constants";
import { Spinner } from "@/components/common/Spinner";

type LittleSpinnerProps = {
  className?: string;
};

const LittleSpinner = ({ className }: LittleSpinnerProps): JSX.Element => {
  return <Spinner className={className} size={SMALL_SPINNER} />;
};

export default LittleSpinner;
