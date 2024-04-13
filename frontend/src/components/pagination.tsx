import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams } from "react-router-dom";

export const DOTS = "...";

const range = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

const generatePagination = (
  currentPage: number,
  totalPageCount: number,
  siblingCount = 1,
) => {
  const totalPageNumbers = siblingCount + 5;

  if (totalPageNumbers >= totalPageCount) {
    return range(1, totalPageCount);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(
    currentPage + siblingCount,
    totalPageCount,
  );
  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

  const firstPageIndex = 1;
  const lastPageIndex = totalPageCount;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = range(1, leftItemCount);

    return [...leftRange, DOTS, totalPageCount];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = range(
      totalPageCount - rightItemCount + 1,
      totalPageCount,
    );
    return [firstPageIndex, DOTS, ...rightRange];
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = range(leftSiblingIndex, rightSiblingIndex);
    return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
  }
};

export default function UrlPagination({ totalPages }: { totalPages: number }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const allPages = generatePagination(currentPage, totalPages);

  return (
    <Pagination className="py-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className="cursor-pointer"
            onClick={() => {
              searchParams.set("page", Math.max(currentPage - 1, 1).toString());
              setSearchParams(searchParams);
            }}
          />
        </PaginationItem>
        {allPages!.map((page, index) => {
          if (page === DOTS) {
            return (
              <PaginationEllipsis key={index} className="hidden sm:flex" />
            );
          }

          return (
            <PaginationItem
              key={index}
              className="hidden cursor-pointer sm:flex"
            >
              <PaginationLink
                onClick={() => {
                  searchParams.set("page", page.toString());
                  setSearchParams(searchParams);
                }}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <PaginationNext
            className="cursor-pointer"
            onClick={() => {
              searchParams.set(
                "page",
                Math.min(currentPage + 1, totalPages).toString(),
              );
              setSearchParams(searchParams);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
