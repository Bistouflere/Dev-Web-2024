import {
  userFollowersCountQueryOptions,
  userFollowersQueryOptions,
} from "@/api/users";
import UrlPagination from "@/components/pagination";
import { Search } from "@/components/search";
import { TableLoader } from "@/components/table-loader";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { UserList } from "@/components/users/list";
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { ChevronRightIcon } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const USERS_PER_PAGE = 10;

export default function FollowersPage() {
  const { userId } = useAuth();
  const [searchParams] = useSearchParams();

  const query = searchParams.get("query") || "";
  const page = Number(searchParams.get("page")) || 1;

  const countQuery = useQuery(userFollowersCountQueryOptions(userId, query));
  const usersQuery = useQuery(userFollowersQueryOptions(query, query, page));
  const pageCount = Math.ceil(countQuery.data! / USERS_PER_PAGE);

  const startUserIndex = (page - 1) * USERS_PER_PAGE + 1;
  const endUserIndex = Math.min(
    startUserIndex + USERS_PER_PAGE - 1,
    countQuery.data || 0,
  );

  return (
    <main className="relative py-6 lg:gap-10 lg:py-8">
      <div className="mx-auto w-full min-w-0">
        <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
            Dashboard
          </div>
          <ChevronRightIcon className="h-4 w-4" />
          <div className="font-medium text-foreground">Your Followers</div>
        </div>
        <div className="space-y-2">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Your Followers
          </h1>
          <p className="pb-2 text-xl text-muted-foreground">
            Here you can see all of your followers. You can search for them by
            using the search bar below.
          </p>
          <Search placeholder="Search followers..." />
          <Card>
            <CardContent>
              {countQuery.isLoading ||
              usersQuery.isLoading ||
              countQuery.isFetching ||
              usersQuery.isFetching ? (
                <TableLoader count={USERS_PER_PAGE} />
              ) : (
                <UserList response={usersQuery.data || []} />
              )}
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing{" "}
                <strong>
                  {startUserIndex}-{endUserIndex}
                </strong>{" "}
                of <strong>{countQuery.data || 0}</strong> users
              </div>
            </CardFooter>
          </Card>
          {pageCount > 1 && <UrlPagination totalPages={pageCount} />}
        </div>
      </div>
    </main>
  );
}
