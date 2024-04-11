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
import { useQuery } from "@tanstack/react-query";
import { BarChart, DollarSign, Gamepad, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Balancer from "react-wrap-balancer";

export default function IndexPage() {
  const { data: tournaments } = useQuery(tournamentPopularQueryOptions());

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
      <div>
        {tournaments ? (
          <section className="flex items-center justify-center">
            <Carousel className="w-full">
              <CarouselContent>
                {tournaments.map((response) => (
                  <CarouselItem className="basis-1/3">
                    <Card className="w-full">
                      <CardContent>
                        <div className="flex flex-1 mt-4 gap-2 flex-col justify-between lg:flex-row">
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
                              className="rounded-lg"
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
          </section>
        ) : null}
      </div>
    </div>
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
    <div className="flex justify-between flex-col lg:flex-row">
      <p className="flex font-medium text-normal items-center">
        {icon}
        {title}
      </p>
      <p className="font-medium text-normal">{result}</p>
    </div>
  );
}
