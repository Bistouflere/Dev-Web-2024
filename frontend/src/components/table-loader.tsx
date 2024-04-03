import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TableLoader({ count }: { count: number }) {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden w-[100px] sm:table-cell">
            <span className="sr-only">User Avatar</span>
          </TableHead>
          <TableHead>
            <Skeleton className="h-3 w-[50px]" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-3 w-[50px]" />
          </TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {skeletons.map((_, index) => (
          <TableRow key={index}>
            <TableCell className="hidden sm:table-cell">
              <Skeleton className="aspect-square rounded-md object-cover" />
            </TableCell>
            <TableCell className="font-medium">
              <Skeleton className="h-3 w-[100px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-3 w-[100px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-3 w-[100px]" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
