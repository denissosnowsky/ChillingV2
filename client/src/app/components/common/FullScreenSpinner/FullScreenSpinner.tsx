"use client";

import { Loading as Spinner } from "@web3uikit/core";

type FullScreenSpinnerProps = {
  className?: string;
};

const FullScreenSpinner = ({
  className,
}: FullScreenSpinnerProps): JSX.Element => {
  return (
    <div className={`h-full flex items-center justify-center ${className}`}>
      <Spinner size={140} spinnerColor="#2E7DAF" />
    </div>
  );
};

export default FullScreenSpinner;
