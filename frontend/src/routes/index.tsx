import { tournamentPopularQueryOptions } from "@/api/tournaments";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useQuery } from "@tanstack/react-query";
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
                    <Card>
                      <CardContent className="flex flex-none grid grid-cols-2 grid-rows-3 gap-3 py-5 place-items-center h-500">
                        <div className="flex basis-1/2 row-span-3 self-center">
                          <img src="https://fs-prod-cdn.nintendo-europe.com/media/images/10_share_images/games_15/nintendo_switch_4/H2x1_NSwitch_SuperSmashBrosUltimate_02_image1600w.jpg" />
                        </div>
                        <div className="flex-wrap col-start-2 row-start-1">
                          {response.tournament_name}
                        </div>
                        <div className="flex-wrap grid col-start-2 row-start-2">
                          ${response.cash_prize || 0}
                        </div>
                        <div className="flex-wrap col-start-2 row-start-3"></div>
                      </CardContent>
                      <CardFooter className="flex flex-none justify-center">
                        <div className="flex flex-wrap ">
                          {response.start_date}
                        </div>
                      </CardFooter>
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
