"use client";

import { Loading as Spinner } from "@web3uikit/core";

export default function Loading() {
  return (
    <div className="h-full flex items-center justify-center">
      <Spinner size={140} spinnerColor="#2E7DAF" />
    </div>
  );
}
