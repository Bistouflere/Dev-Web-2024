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
import { Tournament } from "@/types/apiResponses";
import { BarChart, DollarSign, Gamepad, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function TournamentsCarousel({
  tournaments,
}: {
  tournaments: Tournament[];
}) {
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
            <Card className="w-full h-full">
              <CardContent className="flex flex-col justify-between h-full">
                <div className="flex mt-4 gap-2 justify-between flex-row">
                  <div>
                    <CardTitle>{response.name}</CardTitle>
                    <CardDescription>
                      {response.description || "No description"}
                    </CardDescription>{" "}
                  </div>
                  <Link
                    to={`/tournaments/${response.id}`}
                    className="items-center w-1/2"
                  >
                    <img
                      src={response.image_url || undefined}
                      alt={response.name}
                      className="rounded-lg max-h-40 object-cover"
                    />
                  </Link>
                </div>
                <div className="mt-2">
                  <TournamentDetail
                    icon={<Users className="w-5 h-5 mr-2" />}
                    title="Members"
                    result={response.users_count}
                  />
                  <TournamentDetail
                    icon={<DollarSign className="w-5 h-5 mr-2" />}
                    title="Cash Prize"
                    result={`$${response.cash_prize || 0}`}
                  />
                  <TournamentDetail
                    icon={<BarChart className="w-5 h-5 mr-2" />}
                    title="Status"
                    result={response.status}
                  />
                  <TournamentDetail
                    icon={<Gamepad className="w-5 h-5 mr-2" />}
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
    <div className="flex justify-between flex-row">
      <p className="flex font-medium text-normal items-center">
        {icon}
        {title}
      </p>
      <p className="font-medium text-normal">{result}</p>
    </div>
  );
}
