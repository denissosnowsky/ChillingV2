import { ethers } from "ethers";
import { Input } from "@web3uikit/core";
import { ChangeEvent, useState } from "react";

import { useTransfer } from "@/api/hooks";
import { Button } from "@/components/common/Button";

type TransferModalContentProps = {
  address: string;
  onClose?: () => void;
  refetchBalance: () => void;
};

const TransferModalContent = ({
  address,
  onClose,
  refetchBalance,
}: TransferModalContentProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const [transferSum, setTransferSum] = useState<number | "">("");

  const { transfer } = useTransfer(setIsLoading, refetchBalance);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTransferSum(Number(e.target.value));
  };

  const makeTransfer = async () => {
    setIsLoading(true);
    await transfer(address, (transferSum as number) * 1e18);
    if (onClose) onClose();
  };

  return (
    <div className="w-full flex flex-col gap-2 items-center mb-10">
      <div className="flex gap-3 items-center mb-11">
        <Input
          type="number"
          value={transferSum!}
          onChange={onChange}
          placeholder="Enter a  sum to transfer..."
        />
        <span>ETH</span>
      </div>
      <Button
        color="yellow"
        theme="colored"
        text="Transfer"
        isLoading={isLoading}
        onClick={makeTransfer}
        disabled={!!transferSum && transferSum <= 0}
      />
    </div>
  );
};

export default TransferModalContent;
