import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useAuth } from "@clerk/clerk-react";
import { Plus, SearchIcon } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";

export function Search({
  placeholder,
  button_placeholder,
  button_path,
}: {
  placeholder: string;
  button_placeholder?: string;
  button_path?: string;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { userId } = useAuth();

  const handleSearch = useDebouncedCallback((query) => {
    console.log(`Searching... ${query}`);

    searchParams.set("page", "1");
    setSearchParams(searchParams);

    if (query) {
      searchParams.set("query", query);
      setSearchParams(searchParams);
    } else {
      searchParams.delete("query");
      setSearchParams(searchParams);
    }
  }, 300);

  return (
    <div className="flex items-center justify-end space-x-4 pb-4">
      <div className="relative flex w-full items-center">
        <span className="sr-only">Search Bar</span>
        <Input
          name="search"
          id="search"
          type="text"
          className="peer pl-10"
          placeholder={placeholder}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          defaultValue={searchParams.get("query")?.toString()}
        />
        <SearchIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground peer-focus:text-gray-900" />
      </div>
      {button_placeholder && button_path && (
        <Link to={userId ? button_path : "/sign-in"} className="ml-4">
          <Button>
            <Plus className="h-5 w-5 sm:mr-2" />
            <span className="sr-only sm:hidden">{button_placeholder}</span>
            <span className="hidden sm:inline">{button_placeholder}</span>
          </Button>
        </Link>
      )}
    </div>
  );
}
