import { followUser, unfollowUser } from "@/api/userActions";
import { userQueryOptions } from "@/api/users";
import { useToast } from "@/components/ui/use-toast";
import UserProfileCard from "@/components/users/profile-card";
import UserStatisticsCard from "@/components/users/statistics-card";
import UserTeamsTable from "@/components/users/teams-card";
import UserTournamentsTable from "@/components/users/tournaments-card";
import { useAuth } from "@clerk/clerk-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";

export default function UserProfile() {
  const [loading, setLoading] = useState(false);
  const { searchUserId } = useParams();
  const { userId, getToken } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user } = useQuery(userQueryOptions(searchUserId));

  const invalidateQueries = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [`users`],
    });
    queryClient.invalidateQueries({
      queryKey: [`user`],
    });
    queryClient.invalidateQueries({
      queryKey: [`followers_count`],
    });
    queryClient.invalidateQueries({
      queryKey: [`following_count`],
    });
    queryClient.invalidateQueries({
      queryKey: [`is_following`],
    });
    queryClient.invalidateQueries({
      queryKey: [`followers`],
    });
    queryClient.invalidateQueries({
      queryKey: [`following`],
    });
  }, [queryClient]);

  const handleFollowUser = async () => {
    try {
      setLoading(true);
      await followUser(searchUserId || "", getToken, invalidateQueries);
      toast({
        title: "Success!",
        description: `You are now following ${user?.username}.`,
      });

      setTimeout(() => {
        setLoading(false);
      }, 200);
    } catch (error) {
      setLoading(false);
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
      setLoading(true);
      await unfollowUser(searchUserId || "", getToken, invalidateQueries);
      toast({
        title: "Success!",
        description: `You are no longer following ${user?.username}.`,
      });

      setTimeout(() => {
        setLoading(false);
      }, 200);
    } catch (error) {
      setLoading(false);
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
            handleFollowUser={handleFollowUser}
            handleUnfollowUser={handleUnfollowUser}
            loading={loading}
          />
          <div className="flex flex-auto flex-col gap-4">
            <UserStatisticsCard user={user} />
            <UserTeamsTable user={user} searchUserId={searchUserId} />
            <UserTournamentsTable
              user={user}
              searchUserId={searchUserId}
              title="Tournaments"
              filters={["upcoming", "active"]}
            />
            <UserTournamentsTable
              user={user}
              searchUserId={searchUserId}
              title="Past Tournaments"
              filters={["completed", "cancelled"]}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
