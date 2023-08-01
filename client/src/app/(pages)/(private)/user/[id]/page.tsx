import { Footer } from "@/components/Footer";
import { UserHeader } from "./components/UserHeader";
import { UserPosts } from "./components/UserPosts";

type UserIdProps = {
  params: { id: string };
};

const UserId = ({ params: { id } }: UserIdProps): JSX.Element => {
  return (
    <div className="page">
      <UserHeader />
      <UserPosts />
      <Footer />
    </div>
  );
};

export default UserId;
