import Logo from "@/components/common/Logo/Logo";
import { MIDIUM_LOGO_SIZE, aboutText } from "@/constants/common";

const About = (): JSX.Element => {
  return (
    <main className="page flex flex-col pb-7 items-center pt-10">
      <div className="text-header mb-8 text-mainThree-light">Hi there!</div>
      <div className="w-2/3 text-center mb-7">{aboutText}</div>
      <Logo size={MIDIUM_LOGO_SIZE} />
    </main>
  );
};

export default About;
