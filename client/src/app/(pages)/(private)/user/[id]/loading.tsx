"use client";

import { FullScreenSpinner } from "@/components/common/FullScreenSpinner";

export default function Loading() {
  return (
    <div className="h-screen flex felx-col items-center justify-center">
      <FullScreenSpinner className="mb-20" />
    </div>
  );
}
