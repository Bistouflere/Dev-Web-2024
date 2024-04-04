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
import { Tournament } from "@/types/type";
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
          <TableHead>Cash Prize</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {response.map((response: Tournament) => (
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
            <TableCell>${response.cash_prize}</TableCell>
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
                    <Link to={`/tournaments/${response.name}`}>
                      View Tournament
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      console.log(
                        `Register for the tournament ${response.name}`,
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
