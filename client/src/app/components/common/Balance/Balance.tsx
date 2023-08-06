import { Eth } from "@web3uikit/icons";

import { MEDIUM_BUTTON_FONT_SIZE } from "@/constants/common";

type BalanceProps = {
  balance: string;
};

const Balance = ({ balance }: BalanceProps): JSX.Element => {
  return (
    <div className="flex items-center pr-1 text-lg">
      <span>Balance: {balance.slice(0, 10)}</span>
      <Eth fontSize={MEDIUM_BUTTON_FONT_SIZE} />
    </div>
  );
};

export default Balance;
