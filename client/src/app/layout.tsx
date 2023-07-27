import "./globals.css";

import type { Metadata } from "next";
import { Inconsolata } from "next/font/google";

import { Providers } from "@/providers";

const font = Inconsolata({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chilling",
  description: "Blockchain social media",
};

const RootLayout = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  return (
    <html lang="en">
      <body
        className={`text-2xl h-screen bg-gradient-to-b from-mainOne-light via-mainTwo-light to-mainThree-light ${font.className}`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
