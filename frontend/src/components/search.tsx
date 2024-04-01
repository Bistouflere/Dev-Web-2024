import { Input } from "./ui/input";
import { SearchIcon } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";

export function Search({ placeholder }: { placeholder: string }) {
  const [searchParams, setSearchParams] = useSearchParams();

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
    <div className="relative py-4">
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
  );
}
