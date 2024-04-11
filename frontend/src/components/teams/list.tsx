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
import { Team } from "@/types/apiResponses";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

export function TeamList({ response }: { response: Team[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden w-[100px] sm:table-cell">
            <span className="sr-only">Team Avatar</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Members</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {response.map((response) => (
          <TableRow key={response.id}>
            <TableCell className="hidden sm:table-cell">
              <Link to={`/teams/${response.id}`}>
                <img
                  className="aspect-square rounded-md object-cover"
                  src={response.image_url || undefined}
                  alt={response.name}
                />
              </Link>
            </TableCell>
            <TableCell className="font-medium">
              <Link to={`/teams/${response.id}`}>{response.name}</Link>
            </TableCell>
            <TableCell>{response.description}</TableCell>
            <TableCell>{response.users_count}</TableCell>
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
                    <Link to={`/teams/${response.id}`}>View Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      console.log(`Added Friend ${response.id}`);
                    }}
                  >
                    Follow User
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
