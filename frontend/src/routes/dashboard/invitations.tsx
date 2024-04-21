import { userInvitationsQueryOptions } from "@/api/users";
import { DashboardInvitationList } from "@/components/dashboard/invitation-list";
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { ChevronRightIcon } from "lucide-react";

export default function InvitationsPage() {
  const { userId, getToken } = useAuth();

  const { data: invitations } = useQuery(
    userInvitationsQueryOptions(userId, getToken),
  );

  return (
    <main className="relative py-6 lg:gap-10 lg:py-8">
      <div className="mx-auto w-full min-w-0">
        <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
            Dashboard
          </div>
          <ChevronRightIcon className="h-4 w-4" />
          <div className="font-medium text-foreground">Invitations</div>
        </div>
        <div className="space-y-2">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Invitations
          </h1>
          <p className="pb-2 text-xl text-muted-foreground">
            Manage your invitations and join a team!
          </p>
          <DashboardInvitationList response={invitations || []} />
        </div>
      </div>
    </main>
  );
}
