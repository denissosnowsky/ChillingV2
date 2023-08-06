export type WelcomePageButton = {
  text: "Sign Up" | "Sign In" | "About";
  href: "/signUp" | "/signIn" | "/about";
};

export type AccountInfo = {
  accountAddress: string;
  description: string;
  followersCount: BigInt;
  followingsCount: BigInt;
  image: string;
  isSenderFollower: boolean;
  isSenderFollowing: boolean;
  name: string;
  postsCount: BigInt;
};

export type AccountPost = {
  index: BigInt;
  timestamp: BigInt;
  likesCount: BigInt;
  dislikesCount: BigInt;
  commentsCount: BigInt;
  author: string;
  image: string;
  text: string;
  isLikedBySender: boolean;
  isDislikedBySender: boolean;
};

export type UserAccountShort = {
  name: string;
  image: string;
  accountAddress: string;
  isSenderFollowing: boolean;
  isSenderFollower: boolean;
};

export type Comment = {
  text: string;
  name: string;
  image: string;
  author: string;
};

export type UseFetchUsers = {
  data: UserAccountShort[];
  hasMore: boolean;
  error: Error | null;
  isLoading: boolean;
  fetchMore: () => Promise<void>;
};
