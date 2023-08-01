import Link from "next/link";

const Footer = (): JSX.Element => {
  return (
    <div className="w-full h-20 mt-3 flex items-center text-base underline cursor-pointer">
      <Link href="/about">About</Link>
    </div>
  );
};

export default Footer;
