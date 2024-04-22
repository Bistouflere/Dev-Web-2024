import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, DollarSign, Gamepad, Users } from "lucide-react";

export default function LoadingTournamentsCarousel({
  count,
}: {
  count: number;
}) {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  return (
    <Carousel
      className="w-full"
      opts={{
        align: "start",
        loop: true,
      }}
    >
      <CarouselContent className="-ml-1">
        {skeletons.map((_, index) => (
          <CarouselItem className="md:basis-1/2 lg:basis-1/3" key={index}>
            <Card className="h-full w-full">
              <CardContent className="flex h-full flex-col justify-between">
                <div className="mt-4 flex flex-row justify-between gap-2">
                  <div>
                    <Skeleton className="h-10 w-[200px]" />
                    <Skeleton className="mt-2 h-5 w-[200px]" />
                    <Skeleton className="mt-2 h-5 w-[150px]" />
                  </div>
                  <div className="items-center">
                    <Skeleton className="aspect-square w-32 rounded-lg object-cover" />
                  </div>
                </div>
                <div className="mt-2">
                  <TournamentDetail
                    icon={<Users className="mr-2 h-5 w-5" />}
                    title="Members"
                  />
                  <TournamentDetail
                    icon={<DollarSign className="mr-2 h-5 w-5" />}
                    title="Cash Prize"
                  />
                  <TournamentDetail
                    icon={<BarChart className="mr-2 h-5 w-5" />}
                    title="Status"
                  />
                  <TournamentDetail
                    icon={<Gamepad className="mr-2 h-5 w-5" />}
                    title="Game"
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
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex flex-row justify-between">
      <p className="text-normal flex items-center font-medium">
        {icon}
        {title}
      </p>
      <Skeleton className="h-5 w-[50px]" />
    </div>
  );
}
