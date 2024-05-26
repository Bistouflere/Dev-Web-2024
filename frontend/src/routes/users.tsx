import { usersQueryOptions } from "@/api/users";
import { columns } from "@/components/users/user-table/columns";
import { UserTable } from "@/components/users/user-table/table";
import { useQuery } from "@tanstack/react-query";
import Balancer from "react-wrap-balancer";

export default function UsersPage() {
  const { data: users } = useQuery(usersQueryOptions());

  return (
    <div className="container relative">
      <section className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
        <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
          Find friends and adversaries
        </h1>
        <Balancer className="max-w-[750px] text-center text-lg text-muted-foreground sm:text-xl">
          Browse through our users and find the perfect match for your team. You
          can search for users by their username, email, or name.
        </Balancer>
      </section>
      <UserTable columns={columns} data={users || []} />
    </div>
  );
}
