import { ChevronRightIcon } from "lucide-react";
import { useParams } from "react-router-dom";
import Balancer from "react-wrap-balancer";

export default function TeamDetailPage() {
  const { searchTeamId } = useParams();

  return (
    <main className="relative py-6 lg:gap-10 lg:py-8">
      <div className="mx-auto w-full min-w-0">
        <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
            Dashboard
          </div>
          <ChevronRightIcon className="h-4 w-4" />
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
            Your Teams
          </div>
          <ChevronRightIcon className="h-4 w-4" />
          <div className="font-medium text-foreground">{searchTeamId}</div>
        </div>
        <div className="space-y-2">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            {searchTeamId}
          </h1>
          <p className="text-lg text-muted-foreground">
            <Balancer>This is the protected settings page.</Balancer>
          </p>
        </div>
      </div>
    </main>
  );
}
