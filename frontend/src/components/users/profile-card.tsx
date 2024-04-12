import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/types/apiResponses";
import dayjs from "dayjs";
import { Minus, Plus, UserPlus } from "lucide-react";

export default function UserProfileCard({
  user,
  userId,
  userFollowers,
  userFollowing,
  handleFollowUser,
  handleUnfollowUser,
}: {
  user: User;
  userId: string | null | undefined;
  userFollowers: User[];
  userFollowing: User[];
  handleFollowUser: () => void;
  handleUnfollowUser: () => void;
}) {
  return (
    <div className="flex-none">
      <Card>
        <CardHeader>
          <CardTitle>{user.username}'s Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-2">
            <img
              className="aspect-square rounded-md object-cover w-24 h-24"
              src={user.image_url || undefined}
              alt={user.username}
            />
            <p className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
              {user.username}
            </p>
            <p className="text-sm text-muted-foreground">
              {user.email_address}
            </p>
          </div>
          <div className="mt-4 flex justify-center space-x-4">
            <Button
              onClick={() =>
                userFollowers?.find(
                  (follower) => follower.clerk_user_id === userId,
                )
                  ? handleUnfollowUser()
                  : handleFollowUser()
              }
              disabled={!userId || userId === user.clerk_user_id}
            >
              {userFollowers?.find(
                (follower) => follower.clerk_user_id === userId,
              ) ? (
                <>
                  <Minus className="mr-2 h-5 w-5" />
                  Unfollow
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-5 w-5" />
                  Follow
                </>
              )}
            </Button>
            <Button
              variant="secondary"
              onClick={() => console.log("recruit", user.id)}
              disabled={!userId || userId === user.clerk_user_id}
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Recruit
            </Button>
          </div>
          <div className="mt-4">
            <UserDetail
              title="Followers"
              result={userFollowers ? userFollowers.length : 0}
            />
            <UserDetail
              title="Following"
              result={userFollowing ? userFollowing.length : 0}
            />
            <UserDetail
              title="Member Since"
              result={dayjs(user.created_at).format("DD/MM/YYYY")}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function UserDetail({
  title,
  result,
}: {
  title: string;
  result: string | number;
}) {
  return (
    <div className="flex justify-between">
      <small className="text-sm font-medium leading-none">{title}</small>
      <small className="text-sm font-medium leading-none">{result}</small>
    </div>
  );
}
