import { CopyButton } from "@web3uikit/core";

type AddressProps = {
  address: string;
};

const Address = ({ address }: AddressProps): JSX.Element => {
  const addressLength = address.length;
  const shortAddress = `${address.slice(0, 4)}...${address.slice(
    addressLength - 4,
    addressLength
  )}`;

  return (
    <div className="flex items-center">
      <span className="pr-1 text-lg">{shortAddress}</span>
      <CopyButton hasTooltip text={address} />
    </div>
  );
};

export default Address;
