import { teamTournamentUsersQueryOptions } from "@/api/teams";
import { columns } from "@/components/dashboard/team-tournaments-users-table/columns";
import { DashboardTeamTournamentUsersTable } from "@/components/dashboard/team-tournaments-users-table/table";
import { useQuery } from "@tanstack/react-query";
import { ChevronRightIcon } from "lucide-react";
import { Link, useParams } from "react-router-dom";

export default function TeamTournamentUsersPage() {
  const { searchTeamId, searchTournamentId } = useParams();

  const { data: users } = useQuery(
    teamTournamentUsersQueryOptions(
      searchTeamId || "",
      searchTournamentId || "",
    ),
  );

  return (
    <main className="relative py-6 lg:gap-10 lg:py-8">
      <div className="mx-auto w-full min-w-0">
        <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
            Dashboard
          </div>
          <ChevronRightIcon className="h-4 w-4" />
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
            <Link to="/dashboard/teams">Your Teams</Link>
          </div>
          <ChevronRightIcon className="h-4 w-4" />
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
            <Link to={`/dashboard/teams/${searchTeamId}`}>{searchTeamId}</Link>
          </div>
          <ChevronRightIcon className="h-4 w-4" />
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
            Tournaments
          </div>
          <ChevronRightIcon className="h-4 w-4" />
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
            <Link
              to={`/dashboard/teams/${searchTeamId}/tournaments/${searchTournamentId}`}
            >
              {searchTournamentId}
            </Link>
          </div>
          <ChevronRightIcon className="h-4 w-4" />
          <div className="font-medium text-foreground">Users</div>
        </div>
        <div className="space-y-2">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Manage Tournament Users
          </h1>
          <p className="pb-2 text-xl text-muted-foreground">
            Manage the users that are part of this tournament.
          </p>
          <DashboardTeamTournamentUsersTable
            columns={columns}
            data={users || []}
          />
        </div>
      </div>
    </main>
  );
}
