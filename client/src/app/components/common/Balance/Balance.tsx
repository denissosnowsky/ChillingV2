import { MEDIUM_BUTTON_FONT_SIZE } from "@/constants";
import { Eth } from "@web3uikit/icons";

const Balance = (): JSX.Element => {
  return (
    <div className="flex items-center pr-1 text-lg">
      <span>Balance: 0.01</span>
      <Eth fontSize={MEDIUM_BUTTON_FONT_SIZE} />
    </div>
  );
};

export default Balance;
