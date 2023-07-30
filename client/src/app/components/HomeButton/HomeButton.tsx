"use client";

import { useRouter } from "next/navigation";
import { Home } from "@web3uikit/icons";

import { Button } from "@/components/common/Button";
import { BUTTON_FONT_SIZE } from "@/constants";

const HomeButton = (): JSX.Element => {
  const router = useRouter();

  const onNavigateHome = () => router.push("/");

  return (
    <Button
      text="Home"
      onClick={onNavigateHome}
      color="green"
      theme="colored"
      size="large"
      icon={<Home fontSize={BUTTON_FONT_SIZE} />}
    />
  );
};

export default HomeButton;
