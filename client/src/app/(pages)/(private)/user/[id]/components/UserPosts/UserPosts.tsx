"use client";

import { Post } from "@/components/Post";
import { Button } from "@/components/common/Button";
import { Empty } from "@/components/common/Empty";
import { AccountPost } from "@/types";

type UserPostsType = {
  id: string;
  hasMore: boolean;
  isLoading: boolean;
  posts: AccountPost[];
  accountAddress: string;
  fetchMore: () => Promise<void>;
};

const UserPosts = ({
  id,
  posts,
  hasMore,
  fetchMore,
  isLoading,
  accountAddress,
}: UserPostsType): JSX.Element => {
  const emptyText = "No Posts yet";

  return (
    <div className="mt-14 flex flex-col">
      {posts.length ? (
        posts.map((post) => (
          <Post
            post={post}
            userId={id}
            key={post.index.toString()}
            accountAddress={accountAddress}
          />
        ))
      ) : (
        <Empty text={emptyText} className="mt-40" />
      )}
      {hasMore && (
        <Button
          color="green"
          theme="colored"
          text="Load more"
          style={{ marginBottom: 40, alignSelf: "center" }}
          isLoading={isLoading}
          onClick={fetchMore}
        />
      )}
    </div>
  );
};

export default UserPosts;
