import { teamsQueryOptions } from "@/api/teams";
import { columns } from "@/components/teams/team-table/columns";
import { TeamTable } from "@/components/teams/team-table/table";
import { useQuery } from "@tanstack/react-query";
import Balancer from "react-wrap-balancer";

export default function TeamsPage() {
  const { data: teams } = useQuery(teamsQueryOptions());

  return (
    <div className="container relative">
      <section className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
        <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
          Find a team that suits you
        </h1>
        <Balancer className="max-w-[750px] text-center text-lg text-muted-foreground sm:text-xl">
          Browse through our teams and find the perfect one for you. You can
          search for teams by their name, game, or organizer.
        </Balancer>
      </section>
      <TeamTable columns={columns} data={teams || []} />
    </div>
  );
}
