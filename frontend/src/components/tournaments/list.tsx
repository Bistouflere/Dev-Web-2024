import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { APIResult } from "@/types/tournaments";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

export function TournamentList({ response }: { response: APIResult }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden w-[100px] sm:table-cell">
            <span className="sr-only">Tournament Avatar</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Cash Prize</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {response.map((response) => (
          <TableRow key={response.tournament_id}>
            <TableCell className="hidden sm:table-cell">
              <Link to={`/tournaments/${response.tournament_id}`}>
                <img
                  className="aspect-square rounded-md object-cover"
                  src={response.tournament_image_url || undefined}
                  alt={response.tournament_name}
                />
              </Link>
            </TableCell>
            <TableCell className="font-medium">
              <Link to={`/tournaments/${response.tournament_id}`}>
                {response.tournament_name}{" "}
              </Link>
            </TableCell>
            <TableCell>${response.cash_prize || 0}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button aria-haspopup="true" size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <Link to={`/tournaments/${response.tournament_id}`}>
                      View Tournament
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      console.log(
                        `Register for the tournament ${response.tournament_name}`,
                      );
                    }}
                  >
                    Register
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
