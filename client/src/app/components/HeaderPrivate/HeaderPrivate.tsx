"use client";

import { useContext } from "react";

import { BalanceContext } from "@/contexts";
import { Avatar } from "@/components/common/Avatar";
import { HomeButton } from "@/components/HomeButton";
import { Address } from "@/components/common/Address";
import { Balance } from "@/components/common/Balance";
import { SMALL_AVATAR_SIZE } from "@/constants/common";

type HeaderPrivateProps = {
  image: string;
  address: string;
};

const HeaderPrivate = ({ image, address }: HeaderPrivateProps): JSX.Element => {
  const { balance } = useContext(BalanceContext);

  return (
    <div className="flex p-5 w-full justify-between">
      <HomeButton />
      <div className="flex h-full justify-between gap-6">
        <Balance balance={balance} />
        <Address address={address} />
        <div className="h-10 w-10">
          <Avatar size={SMALL_AVATAR_SIZE} src={image} />
        </div>
      </div>
    </div>
  );
};

export default HeaderPrivate;
