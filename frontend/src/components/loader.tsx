import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-96 w-96 animate-spin" />
      </div>
    </div>
  );
}
