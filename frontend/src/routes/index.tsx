import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { TournamentsAPIResponse } from "@/types/type";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import axios from "axios";
import Balancer from "react-wrap-balancer";

function tournamentsOptions() {
  return queryOptions({
    queryKey: ["tournaments_home"],
    queryFn: () => fetchHomeTournaments(),
  });
}

async function fetchHomeTournaments(): Promise<TournamentsAPIResponse[]> {
  return axios
    .get<TournamentsAPIResponse[]>(`/api/tournaments/popular`)
    .then((res) => res.data);
}

export default function IndexPage() {
  const tournamentHomeQuery = useQuery(tournamentsOptions());
  console.log(tournamentHomeQuery.data);

  return (
    <div className="container relative">
      <section className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
        <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
          Welcome to MadBracket
        </h1>
        <Balancer className="max-w-[750px] text-center text-lg text-muted-foreground sm:text-xl">
          Your one-stop shop for all tournament needs. Create, manage, and join
          tournaments with ease.
        </Balancer>
      </section>
      <div className="flex items-center justify-center">
        {tournamentHomeQuery.data ? (
          <section>
            <Carousel>
              <CarouselContent>
                {tournamentHomeQuery.data.map(
                  (response: TournamentsAPIResponse) => (
                    <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                      <Card className="flex aspec-square items-center justify-center p-6">
                        <CardHeader>
                          <CardTitle className="w-full max-w-sm items-center justify-center">
                            {response.tournaments.name}
                          </CardTitle>
                          <CardDescription>
                            {response.tournaments.cash_prize}
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </CarouselItem>
                  ),
                )}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </section>
        ) : null}
      </div>
    </div>
  );
}
