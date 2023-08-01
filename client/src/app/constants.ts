import { WelcomePageButton } from "@/types";

export const BIG_LOGO_SIZE = 300;
export const MIDIUM_LOGO_SIZE = 150;
export const SMALL_LOGO_SIZE = 40;

export const SMALL_BUTTON_FONT_SIZE = 20;
export const MEDIUM_BUTTON_FONT_SIZE = 30;

export const SMALL_AVATAR_SIZE = 40;
export const MEDIUM_AVATAR_SIZE = 70;
export const LARGE_AVATAR_SIZE = 210;

export const WELCOME_PAGE_BUTTONS: WelcomePageButton[] = [
  { text: "Sign Up", href: "/signUp" },
  { text: "Sign In", href: "/signIn" },
  { text: "About", href: "/about" },
];

export const aboutText =
  "Welcome to the groundbreaking world of our blockchain-based social media platform, where freedom of speech reigns supreme! Our platform stands out as a pioneer in the realm of decentralization, offering users an unprecedented level of control over their content. Built on the principles of blockchain technology, it ensures that once you write a post, it remains etched into the digital landscape forever, impervious to censorship or deletion by any entity. This means no more worries about your thoughts being silenced or your contributions vanishing without a trace. Embodying true democracy, this platform is devoid of traditional ownership and administration, placing power directly in the hands of the users themselves. Join us today and be part of the social media revolution where your voice truly matters!";

export const LOCAL_STORAGE_CONFIG = {
  key: "connected",
  value: "injected",
};
