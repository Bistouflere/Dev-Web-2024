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
                          <div className="items-center w-1/2">
                            <img
                              src={response.image_url || undefined}
                              alt={response.name}
                              className="rounded-lg"
                            />
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="flex justify-between">
                            <p className="flex font-medium text-normal items-center">
                              <Users className="w-5 h-5 mr-2" />
                              Members
                            </p>
                            <p className="font-medium text-normal">
                              {response.users_count}
                            </p>
                          </div>
                          <div className="flex justify-between">
                            <p className="flex font-medium text-normal items-center">
                              <DollarSign className="w-5 h-5 mr-2" />
                              Cash Prize
                            </p>
                            <p className="font-medium text-normal">
                              ${response.cash_prize || 0}
                            </p>
                          </div>
                          <div className="flex justify-between">
                            <p className="flex font-medium text-normal items-center">
                              <BarChart className="w-5 h-5 mr-2" />
                              Status
                            </p>
                            <p className="font-medium text-normal">
                              {response.status}
                            </p>
                          </div>
                          <div className="flex justify-between">
                            <p className="flex font-medium text-normal items-center">
                              <Gamepad className="w-5 h-5 mr-2 " />
                              Game
                            </p>
                            <p className="font-medium text-normal">
                              {response.game_name}
                            </p>
                          </div>
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
