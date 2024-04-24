import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useWindowDimensions from "@/hooks/window-dimensions";
import { Team, TeamUser } from "@/types/apiResponses";
import { Link } from "react-router-dom";

export default function TeamMembersCard({
  team,
  users,
  setTab,
}: {
  team: Team;
  users: TeamUser[];
  setTab: (value: string) => void;
}) {
  const { width } = useWindowDimensions();
  const breakpoint = width < 640 ? "sm" : width < 1280 ? "lg" : "xl";

  const userDisplayCount = {
    sm: 3,
    lg: 5,
    xl: 9,
  };

  const visibleUsers = users.slice(0, userDisplayCount[breakpoint]);
  const hiddenUsersCount = users.length - visibleUsers.length;

  return (
    <div className="flex-auto">
      <Card>
        <CardHeader>
          <CardTitle>{team.name}'s Members</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          {visibleUsers.length === 0 && (
            <div className="flex h-20 w-full items-center gap-2 rounded-lg border bg-secondary p-4 lg:w-60">
              <span className="text-lg font-semibold">No members yet</span>
            </div>
          )}
          {visibleUsers.map((user, index) => (
            <UserCard
              key={user.id}
              user={user}
              className={`${index >= userDisplayCount[breakpoint] ? "hidden" : ""}`}
            />
          ))}
          {hiddenUsersCount > 0 && (
            <div
              onClick={() => {
                setTab("members");
              }}
              className="flex h-20 w-full cursor-pointer items-center gap-2 rounded-lg border bg-secondary p-4 hover:border-primary lg:w-60"
            >
              <span className="text-lg font-semibold">
                + {hiddenUsersCount} members ...
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function UserCard({ user, className }: { user: TeamUser; className?: string }) {
  return (
    <Link
      to={`/users/${user.id}`}
      className={`flex h-20 w-full items-center gap-4 rounded-lg border bg-secondary p-4 hover:border-primary lg:w-60 ${className}`}
    >
      <img
        className="aspect-square h-10 w-10 rounded-md object-cover sm:h-12 sm:w-12"
        src={user.image_url || undefined}
        alt={user.username}
        loading="lazy"
      />
      <div className="flex flex-col">
        <span className="text-lg font-semibold">{user.username}</span>
        <span className="text-lg text-muted-foreground">{user.team_role}</span>
      </div>
    </Link>
  );
}
