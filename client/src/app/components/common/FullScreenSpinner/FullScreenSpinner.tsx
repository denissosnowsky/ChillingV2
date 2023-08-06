"use client";

import { BIG_SPINNER } from "@/constants";
import { Spinner } from "@/components/common/Spinner";

type FullScreenSpinnerProps = {
  className?: string;
};

const FullScreenSpinner = ({
  className,
}: FullScreenSpinnerProps): JSX.Element => {
  return <Spinner className={className} size={BIG_SPINNER} />;
};

export default FullScreenSpinner;
