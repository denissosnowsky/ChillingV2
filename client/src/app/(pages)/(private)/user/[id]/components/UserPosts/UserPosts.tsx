'use client'

import { Post } from "@/components/Post";
import { Empty } from "@/components/common/Empty";

const UserPosts = (): JSX.Element => {
  const emptyText = "No Posts yet";
  const posts = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="mt-14 flex flex-col gap-20">
      {posts.length ? (
        posts.map((post, i) => <Post key={i} />)
      ) : (
        <Empty text={emptyText} className="mt-40" />
      )}
    </div>
  );
};

export default UserPosts;
