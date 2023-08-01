"use client";

import { HomeButton } from "@/components/HomeButton";

const HeaderPublic = (): JSX.Element => {
  return (
    <div className="flex p-5 w-full items-center">
      <HomeButton />
    </div>
  );
};

export default HeaderPublic;
