import { userTournamentsQueryOptions } from "@/api/users";
import { DashboardTournamentList } from "@/components/dashboard/tournament-list";
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { ChevronRightIcon } from "lucide-react";

export default function TournamentPage() {
  const { userId } = useAuth();
  const { data: tournaments } = useQuery(userTournamentsQueryOptions(userId));

  return (
    <main className="relative py-6 lg:gap-10 lg:py-8">
      <div className="mx-auto w-full min-w-0">
        <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
            Dashboard
          </div>
          <ChevronRightIcon className="h-4 w-4" />
          <div className="font-medium text-foreground">Your Tournaments</div>
        </div>
        <div className="space-y-2">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Your Tournaments
          </h1>
          <p className="pb-2 text-xl text-muted-foreground">
            Manage your tournaments and start competing with your friends!
          </p>
          <DashboardTournamentList response={tournaments || []} />
        </div>
      </div>
    </main>
  );
}
