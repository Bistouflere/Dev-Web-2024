import { navigationConfig } from "@/config";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";

export default function SideNav() {
  return (
    <div className="w-full">
      {navigationConfig.side?.map((item, index) => (
        <div className="pb-4" key={index}>
          <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">
            {item.title}
          </h4>
          {item?.items?.length && <SidebarItems items={item.items} />}
        </div>
      ))}
    </div>
  );
}

export function SidebarItems({
  items,
}: {
  items: { title: string; path: string; label?: string }[];
}) {
  return (
    <div className="grid grid-flow-row auto-rows-max text-sm">
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end
          className={({ isActive }) => {
            return cn(
              "group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline",
              isActive
                ? "font-medium text-foreground"
                : "text-muted-foreground",
            );
          }}
        >
          {item.title}
          {item.label && (
            <span className="ml-2 rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs leading-none text-[#000000] no-underline group-hover:no-underline">
              {item.label}
            </span>
          )}
        </NavLink>
      ))}
    </div>
  );
}
