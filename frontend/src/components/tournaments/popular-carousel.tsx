import { tournamentPopularQueryOptions } from "@/api/tournaments";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useSuspenseQuery } from "@tanstack/react-query";
import { BarChart, DollarSign, Gamepad, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function TournamentsCarousel() {
  const { data: tournaments } = useSuspenseQuery(
    tournamentPopularQueryOptions(),
  );

  return (
    <Carousel
      className="w-full"
      opts={{
        align: "start",
        loop: true,
      }}
    >
      <CarouselContent className="-ml-1">
        {tournaments.map((response) => (
          <CarouselItem className="md:basis-1/2 lg:basis-1/3" key={response.id}>
            <Card className="h-full w-full">
              <CardContent className="flex h-full flex-col justify-between">
                <div className="mt-4 flex flex-row justify-between gap-2">
                  <div>
                    <CardTitle>{response.name}</CardTitle>
                    <CardDescription>
                      {response.description || "No description"}
                    </CardDescription>{" "}
                  </div>
                  <Link
                    to={`/tournaments/${response.id}`}
                    className="items-center"
                  >
                    <img
                      src={response.image_url || undefined}
                      alt={response.name}
                      className="w-32 rounded-lg object-cover"
                      loading="lazy"
                    />
                  </Link>
                </div>
                <div className="mt-2">
                  <TournamentDetail
                    icon={<Users className="mr-2 h-5 w-5" />}
                    title="Members"
                    result={response.users_count}
                  />
                  <TournamentDetail
                    icon={<DollarSign className="mr-2 h-5 w-5" />}
                    title="Cash Prize"
                    result={`$${response.cash_prize || 0}`}
                  />
                  <TournamentDetail
                    icon={<BarChart className="mr-2 h-5 w-5" />}
                    title="Status"
                    result={response.status}
                  />
                  <TournamentDetail
                    icon={<Gamepad className="mr-2 h-5 w-5" />}
                    title="Game"
                    result={response.game_name}
                  />
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

function TournamentDetail({
  icon,
  title,
  result,
}: {
  icon: React.ReactNode;
  title: string;
  result: string;
}) {
  return (
    <div className="flex flex-row justify-between">
      <p className="text-normal flex items-center font-medium">
        {icon}
        {title}
      </p>
      <p className="text-normal font-medium">{result}</p>
    </div>
  );
}
