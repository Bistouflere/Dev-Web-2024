import { MainFooter } from "@/components/main-footer";
import { MainHeader } from "@/components/main-header";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { ClerkProvider } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet, useNavigate } from "react-router-dom";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 1,
      retry: false,
    },
  },
});

export default function RootLayout() {
  const navigate = useNavigate();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <ClerkProvider
          navigate={navigate}
          publishableKey={PUBLISHABLE_KEY}
          appearance={{
            variables: {
              colorPrimary: "hsl(240 5.9% 10%)",
            },
          }}
        >
          <div className="min-h-screen bg-background font-sans antialiased">
            <div className="relative flex min-h-screen flex-col bg-background">
              <MainHeader />
              <main className="flex-1">
                <Outlet />
              </main>
              <Toaster />
              <MainFooter />
            </div>
          </div>
        </ClerkProvider>
      </ThemeProvider>
      <ReactQueryDevtools buttonPosition="bottom-right" />
    </QueryClientProvider>
  );
}
