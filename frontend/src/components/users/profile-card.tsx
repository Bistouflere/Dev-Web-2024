import { UserRecruit } from "./recruit";
import {
  isFollowingQueryOptions,
  userFollowersCountQueryOptions,
  userFollowingCountQueryOptions,
} from "@/api/users";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/types/apiResponses";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Heart, HeartOff, Loader2 } from "lucide-react";

export default function UserProfileCard({
  user,
  userId,
  handleFollowUser,
  handleUnfollowUser,
  loading,
}: {
  user: User;
  userId: string | null | undefined;
  handleFollowUser: () => void;
  handleUnfollowUser: () => void;
  loading: boolean;
}) {
  const { data: userFollowersCount } = useQuery(
    userFollowersCountQueryOptions(user.id),
  );
  const { data: userFollowingCount } = useQuery(
    userFollowingCountQueryOptions(user.id),
  );
  const { data: isFollowing } = useQuery(
    isFollowingQueryOptions(userId, user.id),
  );

  return (
    <div className="flex-none">
      <Card>
        <CardHeader>
          <CardTitle>{user.username}'s Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-2">
            <img
              className="aspect-square h-24 w-24 rounded-md object-cover"
              src={user.image_url || undefined}
              alt={user.username}
              loading="lazy"
            />
            <p className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
              {user.username}
            </p>
          </div>
          <div className="mt-4 flex justify-center space-x-4">
            {isFollowing ? (
              loading ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Unfollow
                </Button>
              ) : (
                <Button
                  onClick={handleUnfollowUser}
                  disabled={!userId || userId === user.id}
                >
                  <HeartOff className="mr-2 h-5 w-5" />
                  Unfollow
                </Button>
              )
            ) : loading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Follow
              </Button>
            ) : (
              <Button
                onClick={handleFollowUser}
                disabled={!userId || userId === user.id}
              >
                <Heart className="mr-2 h-5 w-5" />
                Follow
              </Button>
            )}
            <UserRecruit user={user} userId={userId} />
          </div>
          <div className="mt-4">
            <UserDetail title="Followers" result={userFollowersCount || 0} />
            <UserDetail title="Following" result={userFollowingCount || 0} />
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
