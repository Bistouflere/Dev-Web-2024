import { userSentInvitationsQueryOptions } from "@/api/users";
import { DashboardSentInvitationList } from "@/components/dashboard/sent-invitation-list";
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { ChevronRightIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function SentInvitationsPage() {
  const { userId, getToken } = useAuth();

  const { data: invitations } = useQuery(
    userSentInvitationsQueryOptions(userId, getToken),
  );

  return (
    <main className="relative py-6 lg:gap-10 lg:py-8">
      <div className="mx-auto w-full min-w-0">
        <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
            Dashboard
          </div>
          <ChevronRightIcon className="h-4 w-4" />
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
            <Link to="/dashboard/teams">Invitations</Link>
          </div>
          <ChevronRightIcon className="h-4 w-4" />
          <div className="font-medium text-foreground">Sent</div>
        </div>
        <div className="space-y-2">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Sent Invitations
          </h1>
          <p className="pb-2 text-xl text-muted-foreground">
            Manage your sent invitations!
          </p>
          <DashboardSentInvitationList response={invitations || []} />
        </div>
      </div>
    </main>
  );
}
