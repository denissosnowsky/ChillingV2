"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/Button";

const HeaderPublic = (): JSX.Element => {
  const router = useRouter();

  const onNavigateHome = () => router.push("/");

  return (
    <div className="flex p-4 w-full">
      <Button
        text="Home"
        onClick={onNavigateHome}
        color="yellow"
        theme="colored"
        size="large"
      />
    </div>
  );
};

export default HeaderPublic;
