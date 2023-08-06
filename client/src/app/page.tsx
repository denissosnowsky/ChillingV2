"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { useMoralis } from "react-moralis";
import { useRouter } from "next/navigation";
import { Averia_Sans_Libre } from "next/font/google";

import Logo from "@/components/common/Logo/Logo";
import { Button } from "@/components/common/Button";
import { BIG_LOGO_SIZE, WELCOME_PAGE_BUTTONS } from "@/constants/common";

const font = Averia_Sans_Libre({ weight: "400", subsets: ["latin"] });

const Home = (): JSX.Element => {
  const router = useRouter();
  const { account } = useMoralis();

  const onNavigate = (href: string) => () => router.push(href);

  return (
    <main className="flex h-full flex-col items-center justify-center">
      <Logo size={BIG_LOGO_SIZE} />
      <div
        className={`${font.className} text-8xl flex gap-2 mt-3 mb-12`}
        children="Welcome to Chilling"
      />
      <div className="flex justify-center gap-3">
        {WELCOME_PAGE_BUTTONS.map(({ text, href }, index) => (
          <Button
            key={index}
            text={text}
            color="green"
            theme="colored"
            size="xl"
            onClick={onNavigate(href)}
          />
        ))}
      </div>
    </main>
  );
};

export default Home;
