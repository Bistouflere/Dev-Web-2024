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
import { Tournament } from "@/types/apiResponses";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

export function TournamentList({ response }: { response: Tournament[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden w-[100px] sm:table-cell">
            <span className="sr-only">Tournament Avatar</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Game</TableHead>
          <TableHead>Members</TableHead>
          <TableHead>Cash Prize</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {response.map((response) => (
          <TableRow key={response.id}>
            <TableCell className="hidden sm:table-cell">
              <Link to={`/tournaments/${response.id}`}>
                <img
                  className="aspect-square rounded-md object-cover"
                  src={response.image_url || undefined}
                  alt={response.name}
                />
              </Link>
            </TableCell>
            <TableCell className="font-medium">
              <Link to={`/tournaments/${response.id}`}>{response.name} </Link>
            </TableCell>
            <TableCell>{response.game_name}</TableCell>
            <TableCell>{response.users_count}</TableCell>
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
                    <Link to={`/tournaments/${response.id}`}>
                      View Tournament
                    </Link>
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
