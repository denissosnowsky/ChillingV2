"use client";

import { Metamask } from "@web3uikit/icons";

import { Button } from "@/components/common/Button";

const WalletNote = (): JSX.Element => {
  const ICON_SIZE = 40;
  const LINK_SIZE = 15;

  return (
    <div className="pt-16 flex flex-col items-center">
      <div className="mb-11">Please connect to MetaMask to proceed</div>
      <div className="flex flex-col gap-4 items-center">
        <Button
          text="Connect to MetaMask"
          icon={<Metamask fontSize={ICON_SIZE} />}
          color="yellow"
          theme="colored"
          size="xl"
        />
        <a href="https://metamask.io/" target="_blank">
          <Button theme="link" text="What is MetaMask?" fontSize={LINK_SIZE} />
        </a>
      </div>
    </div>
  );
};

export default WalletNote;
