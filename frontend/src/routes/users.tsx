import UrlPagination from "@/components/pagination";
import { Search } from "@/components/search";
import { TableLoader } from "@/components/table-loader";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { UserList } from "@/components/users/list";
import { UsersAPIResponse } from "@/types/type";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import Balancer from "react-wrap-balancer";

function countOptions(query: string) {
  return queryOptions({
    queryKey: ["count_users", query],
    queryFn: () => fetchCount(query),
    placeholderData: keepPreviousData,
  });
}

function usersOptions(query: string, page: number) {
  return queryOptions({
    queryKey: ["users", query, page],
    queryFn: () => fetchUsers(query, page),
    placeholderData: keepPreviousData,
  });
}

async function fetchCount(query: string): Promise<number> {
  return axios
    .get<number>(`/api/users/count?query=${query}`)
    .then((res) => res.data);
}

async function fetchUsers(
  query: string,
  page: number,
): Promise<UsersAPIResponse[]> {
  return axios
    .get<UsersAPIResponse[]>(`/api/users?page=${page}&query=${query}`)
    .then((res) => res.data);
}

const USERS_PER_PAGE = 9;

export default function UsersPage() {
  const [searchParams] = useSearchParams();

  const query = searchParams.get("query") || "";
  const page = Number(searchParams.get("page")) || 1;

  const countQuery = useQuery(countOptions(query));
  const usersQuery = useQuery(usersOptions(query, page));
  const pageCount = Math.ceil(countQuery.data! / USERS_PER_PAGE);

  const startUserIndex = (page - 1) * USERS_PER_PAGE + 1;
  const endUserIndex = Math.min(
    startUserIndex + USERS_PER_PAGE - 1,
    countQuery.data || 0,
  );

  return (
    <div className="container relative">
      <div className="bg-[url('/blurry.svg')] bg-no-repeat bg-center bg-origin-content bg-cover">
        <section className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
          <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
            Find friends and adversaries
          </h1>
          <Balancer className="max-w-[750px] text-center text-lg text-muted-foreground sm:text-xl">
            Browse through our users and find the perfect match for your team.
            You can search for users by their username, email, or name.
          </Balancer>
        </section>
        <Search placeholder="Search users..." />
      </div>
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
  );
}
