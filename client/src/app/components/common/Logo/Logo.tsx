import Image from "next/image";

import logo from "@/assets/logo.png";
import { BIG_LOGO_SIZE, MIDIUM_LOGO_SIZE } from "@/constants";

type LogoProps = {
  size: typeof BIG_LOGO_SIZE | typeof MIDIUM_LOGO_SIZE;
};

const Logo = ({ size }: LogoProps): JSX.Element => (
  <Image alt="logo" src={logo} height={size} width={size} />
);

export default Logo;
