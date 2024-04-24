import { tournamentsQueryOptions } from "@/api/tournaments";
import { columns } from "@/components/tournaments/tournament-table/columns";
import { TournamentTable } from "@/components/tournaments/tournament-table/table";
import { useQuery } from "@tanstack/react-query";
import Balancer from "react-wrap-balancer";

export default function TournamentsPage() {
  const { data: tournaments } = useQuery(tournamentsQueryOptions());

  return (
    <div className="container relative">
      <section className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
        <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
          Fight for glory in our tournaments
        </h1>
        <Balancer className="max-w-[750px] text-center text-lg text-muted-foreground sm:text-xl">
          Browse through our tournaments and find the perfect one for your team.
          You can search for tournaments by their name, game, or organizer.
        </Balancer>
      </section>
      <TournamentTable columns={columns} data={tournaments || []} />
    </div>
  );
}
