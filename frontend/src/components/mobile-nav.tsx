import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { navigationConfig } from "@/config";
import { useAuth } from "@clerk/clerk-react";
import { Menu, Network } from "lucide-react";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

export function MobileNav() {
  const { userId } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <nav className="grid gap-6 text-lg font-medium">
          <NavLink
            to="/"
            className="flex items-center gap-2 text-lg font-semibold"
            onClick={() => setOpen(false)}
          >
            <Network className="h-6 w-6" />
            <span className="inline-block font-bold">MadBracket</span>
          </NavLink>
          <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
            <div className="flex flex-col space-y-3">
              {navigationConfig.main?.map(
                (item) =>
                  item.path && (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end
                      onClick={() => setOpen(false)}
                      className={({ isActive }) => {
                        return isActive
                          ? "hover:text-foreground"
                          : "text-muted-foreground hover:text-foreground";
                      }}
                    >
                      {item.title}
                    </NavLink>
                  ),
              )}
            </div>
            {userId && (
              <div className="flex flex-col space-y-2">
                {navigationConfig.side?.map((item, index) => (
                  <div key={index} className="flex flex-col space-y-3 pt-6">
                    <h4 className="font-medium">{item.title}</h4>
                    {item?.items?.length &&
                      item.items.map((item) => (
                        <React.Fragment key={item.path}>
                          {item.path ? (
                            <NavLink
                              to={item.path}
                              onClick={() => setOpen(false)}
                              end
                              className={({ isActive }) => {
                                return isActive
                                  ? "hover:text-foreground"
                                  : "text-muted-foreground hover:text-foreground";
                              }}
                            >
                              {item.title}
                              {item.label && (
                                <span className="ml-2 rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs leading-none text-[#000000] no-underline group-hover:no-underline">
                                  {item.label}
                                </span>
                              )}
                            </NavLink>
                          ) : (
                            item.title
                          )}
                        </React.Fragment>
                      ))}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
