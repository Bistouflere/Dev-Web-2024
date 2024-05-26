import { userFollowersQueryOptions } from "@/api/users";
import { columns } from "@/components/dashboard/follower-table/columns";
import { DashboardFollowerTable } from "@/components/dashboard/follower-table/table";
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { ChevronRightIcon } from "lucide-react";

export default function FollowersPage() {
  const { userId } = useAuth();
  const { data: users } = useQuery(userFollowersQueryOptions(userId));

  return (
    <main className="relative py-6 lg:gap-10 lg:py-8">
      <div className="mx-auto w-full min-w-0">
        <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
            Dashboard
          </div>
          <ChevronRightIcon className="h-4 w-4" />
          <div className="font-medium text-foreground">Your Followers</div>
        </div>
        <div className="space-y-2">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Your Followers
          </h1>
          <p className="pb-2 text-xl text-muted-foreground">
            Here you can see all of your followers. You can search for them by
            using the search bar below.
          </p>
          <DashboardFollowerTable columns={columns} data={users || []} />
        </div>
      </div>
    </main>
  );
}
