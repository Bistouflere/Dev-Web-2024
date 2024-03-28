import { InnerApp } from "./app";
import "./index.css";
import { ThemeProvider } from "@/components/theme-provider";
import { routeTree } from "@/routeTree.gen";
import { Auth0Provider } from "@auth0/auth0-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";

// Hello je suis un commentaire :)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

const router = createRouter({
  routeTree,
  context: {
    queryClient,
    auth: undefined!,
  },

  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Auth0Provider
            domain={import.meta.env.VITE_AUTH0_DOMAIN!}
            clientId={import.meta.env.VITE_AUTH0_CLIENT_ID!}
            authorizationParams={{
              redirect_uri: window.location.origin,
              audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            }}
            useRefreshTokens={true}
            cacheLocation="localstorage"
          >
            <InnerApp router={router} />
          </Auth0Provider>
        </ThemeProvider>
      </QueryClientProvider>
    </React.StrictMode>,
  );
}
