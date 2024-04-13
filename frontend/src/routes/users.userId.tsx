import { followUser, unfollowUser } from "@/api/userActions";
import {
  userFollowersQueryOptions,
  userFollowingQueryOptions,
  userQueryOptions,
  userTeamsQueryOptions,
  userTournamentsQueryOptions,
} from "@/api/users";
import { useToast } from "@/components/ui/use-toast";
import UserProfileCard from "@/components/users/profile-card";
import UserStatisticsCard from "@/components/users/statistics-card";
import UserTeamsTable from "@/components/users/teams-card";
import UserTournamentsTable from "@/components/users/tournaments-card";
import { useAuth } from "@clerk/clerk-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useParams } from "react-router-dom";

export default function UserProfile() {
  const { searchUserId } = useParams();
  const { userId, getToken } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user } = useQuery(userQueryOptions(searchUserId || ""));
  const { data: userFollowers } = useQuery(
    userFollowersQueryOptions(searchUserId || ""),
  );
  const { data: userFollowing } = useQuery(
    userFollowingQueryOptions(searchUserId || ""),
  );
  const { data: teams } = useQuery(userTeamsQueryOptions(searchUserId || ""));
  const { data: tournaments } = useQuery(
    userTournamentsQueryOptions(searchUserId || ""),
  );

  const invalidateQueries = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [`user_${searchUserId}`] });
    queryClient.invalidateQueries({
      queryKey: [`user_followers_${searchUserId}`],
    });
    queryClient.invalidateQueries({
      queryKey: [`user_following_${searchUserId}`],
    });
  }, [queryClient, searchUserId]);

  const handleFollowUser = async () => {
    try {
      await followUser(searchUserId || "", getToken, invalidateQueries);
      toast({
        title: "Success!",
        description: `You are now following ${user?.username}.`,
      });
    } catch (error) {
      console.error("Error following user:", error);
      toast({
        variant: "destructive",
        title: "Oops!",
        description:
          (error as Error).message ||
          `An error occurred while following ${user?.username}.`,
      });
    }
  };

  const handleUnfollowUser = async () => {
    try {
      await unfollowUser(searchUserId || "", getToken, invalidateQueries);
      toast({
        title: "Success!",
        description: `You are no longer following ${user?.username}.`,
      });
    } catch (error) {
      console.error("Error unfollowing user:", error);
      toast({
        variant: "destructive",
        title: "Oops!",
        description:
          (error as Error).message ||
          `An error occurred while unfollowing ${user?.username}.`,
      });
    }
  };

  return (
    <div className="container py-4">
      {user ? (
        <div className="flex flex-col gap-4 lg:flex-row">
          <UserProfileCard
            user={user}
            userId={userId}
            userFollowers={userFollowers || []}
            userFollowing={userFollowing || []}
            handleFollowUser={handleFollowUser}
            handleUnfollowUser={handleUnfollowUser}
          />
          <div className="flex flex-auto flex-col gap-4">
            <UserStatisticsCard user={user} />
            <UserTeamsTable user={user} teams={teams || []} />
            <UserTournamentsTable
              user={user}
              tournaments={tournaments || []}
              title="Tournaments"
              filters={["upcoming", "active"]}
            />
            <UserTournamentsTable
              user={user}
              tournaments={tournaments || []}
              title="Past Tournaments"
              filters={["completed", "cancelled"]}
            />
          </div>{" "}
        </div>
      ) : null}
    </div>
  );
}
