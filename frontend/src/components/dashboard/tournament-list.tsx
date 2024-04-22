import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { UserTournament } from "@/types/apiResponses";
  import { Link } from "react-router-dom";
  
  export function DashboardTournamentList({ response }: { response: UserTournament[] }) {
    response.sort((a, b) => {
      if (a.tournament_role === "owner") {
        return -1;
      }
      if (b.tournament_role === "owner") {
        return 1;
      }
      if (a.tournament_role === "manager") {
        return -1;
      }
      if (b.tournament_role === "manager") {
        return 1;
      }
      return 0;
    });
  
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden w-[100px] sm:table-cell">
              <span className="sr-only">Tournament Picture</span>
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="hidden lg:table-cell">Description</TableHead>
            <TableHead className="hidden sm:table-cell">Participants</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">
              <span className="sr-only">Edit/View</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {response.map((response) => (
            <TableRow key={response.id}>
              <TableCell className="hidden sm:table-cell">
                <Link
                  to={
                    response.tournament_role === "participant"
                      ? `/tournaments/${response.id}`
                      : `/dashboard/tournaments/${response.id}`
                  }
                >
                  <img
                    className="aspect-square rounded-md object-cover"
                    src={response.image_url || undefined}
                    alt={response.name}
                    loading="lazy"
                  />
                </Link>
              </TableCell>
              <TableCell className="font-medium">
                <Link
                  to={
                    response.tournament_role === "participant"
                      ? `/tournaments/${response.id}`
                      : `/dashboard/tournaments/${response.id}`
                  }
                >
                  {response.name}
                </Link>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {response.description}
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {response.teams_count}
              </TableCell>
              <TableCell>{response.tournament_role}</TableCell>
              <TableCell className="text-right">
                {response.tournament_role === "participant" ? (
                  <Link to={`/tournaments/${response.id}`}>View</Link>
                ) : (
                  <Link to={`/dashboard/tournaments/${response.id}`}>Edit</Link>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
  