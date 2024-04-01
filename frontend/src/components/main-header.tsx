import { DesktopNav } from "@/components/desktop-nav";
import { MobileNav } from "@/components/mobile-nav";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { LogIn } from "lucide-react";
import { Link } from "react-router-dom";

export function MainHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <DesktopNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <ModeToggle />
          <SignedIn>
            <UserButton afterSignOutUrl="/sign-in" />
          </SignedIn>
          <SignedOut>
            <Link to="/sign-in">
              <Button>
                <LogIn className="mr-2 h-5 w-5" /> Sign in
              </Button>
            </Link>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
