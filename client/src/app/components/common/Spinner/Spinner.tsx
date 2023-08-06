"use client";

import { Loading } from "@web3uikit/core";

type SpinnerProps = {
  size: number;
  className?: string;
};

const Spinner = ({ size, className }: SpinnerProps): JSX.Element => {
  return (
    <div className={`h-full flex items-center justify-center ${className}`}>
      <Loading size={size} spinnerColor="#2E7DAF" />
    </div>
  );
};

export default Spinner;
