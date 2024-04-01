import { navigationConfig } from "@/config";
import { useAuth } from "@clerk/clerk-react";
import { Network } from "lucide-react";
import { NavLink } from "react-router-dom";

export function DesktopNav() {
  const { userId } = useAuth();

  return (
    <div className="mr-4 hidden md:flex">
      <NavLink to="/" className="mr-6 flex items-center space-x-2">
        <Network className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">MadBracket</span>
      </NavLink>
      <nav className="flex items-center gap-4 text-sm lg:gap-6">
        {navigationConfig.main?.map(
          (item) =>
            item.path && (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => {
                  return isActive
                    ? "transition-colors hover:text-foreground/80 text-foreground"
                    : "transition-colors hover:text-foreground/80 text-foreground/60";
                }}
              >
                {item.title}
              </NavLink>
            ),
        )}
        {userId && (
          <NavLink
            to="/dashboard"
            className={({ isActive }) => {
              return isActive
                ? "transition-colors hover:text-foreground/80 text-foreground"
                : "transition-colors hover:text-foreground/80 text-foreground/60";
            }}
          >
            Dashboard
          </NavLink>
        )}
      </nav>
    </div>
  );
}
