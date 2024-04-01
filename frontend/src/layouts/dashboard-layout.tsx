import * as React from "react";
import Loader from "@/components/loader";
import SideNav from "@/components/side-nav";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@clerk/clerk-react";
import { Outlet, useNavigate } from "react-router-dom";

export default function DashboardLayout() {
  const { userId, isLoaded } = useAuth();
  const navigate = useNavigate();

  console.log("test", userId);

  React.useEffect(() => {
    if (!userId && isLoaded) {
      navigate("/sign-in");
    }
  }, [userId, isLoaded, navigate]);

  if (!isLoaded && !userId) {
    return <Loader />;
  } else {
    return (
      <div className="border-b">
        <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
          <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
            <ScrollArea className="h-full py-6 pr-6 lg:py-8">
              <SideNav />
            </ScrollArea>
          </aside>
          <Outlet />
        </div>
      </div>
    );
  }
}
