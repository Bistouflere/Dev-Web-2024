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
import { User } from "@/types/type";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

export function UserList({ response }: { response: User[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden w-[100px] sm:table-cell">
            <span className="sr-only">User Avatar</span>
          </TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Email Adresse</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {response.map((response: User) => (
          <TableRow key={response.id}>
            <TableCell className="hidden sm:table-cell">
              <Link to={`/users/${response.id}`}>
                <img
                  className="aspect-square rounded-md object-cover"
                  src={response.image_url || undefined}
                  alt={response.username}
                />
              </Link>
            </TableCell>
            <TableCell className="font-medium">
              <Link to={`/users/${response.id}`}>{response.username}</Link>
            </TableCell>
            <TableCell>{response.email_address}</TableCell>
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
                    <Link to={`/users/${response.id}`}>View Profile</Link>
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
