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

export function UserList({ data }: { data: any[] }) {
  console.log(data[0].users)

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
        {data.map((data: any) => (
          <TableRow key={data.users.id}>
            <TableCell className="hidden sm:table-cell">
              <img
                className="aspect-square rounded-md object-cover"
                src={data.users.image_url}
                alt={data.users.username}
              />
            </TableCell>
            <TableCell className="font-medium">{data.users.username}</TableCell>
            <TableCell>{data.users.email_address}</TableCell>
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
                    <Link to={`/users/${data.users.username}`}>View Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      console.log(`Added Friend ${data.users.username}`);
                    }}
                  >
                    Add Friend
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
