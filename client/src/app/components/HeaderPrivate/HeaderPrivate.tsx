"use client";

import { Avatar } from "@/components/common/Avatar";
import { HomeButton } from "@/components/HomeButton";
import { Address } from "@/components/common/Address";
import { Balance } from "@/components/common/Balance";
import { SMALL_AVATAR_SIZE, SMALL_LOGO_SIZE } from "@/constants";

const HeaderPrivate = (): JSX.Element => {
  return (
    <div className="flex p-5 w-full justify-between">
      <HomeButton />
      <div className="flex h-full justify-between gap-6">
        <Balance />
        <Address address="0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d" />
        <Avatar size={SMALL_AVATAR_SIZE} />
      </div>
    </div>
  );
};

export default HeaderPrivate;
